from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg, Count
from .serializers import AdWisePredictionSerializer, PredictionHistorySerializer
from .services.predictor import PredictionService
from .models import PredictionRecord

class PlatformPredictionView(APIView):
    """
    Class-Based View for social media platform predictions.
    Saves every valid prediction to the persistent history layer.
    """
    
    def post(self, request, *args, **kwargs):
        # 1. Validation
        serializer = AdWisePredictionSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                "status": "error",
                "message": "Submission data validation failed",
                "details": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 2. Extract Business Logic from the Service Layer
            validated_data = serializer.validated_data
            prediction = PredictionService.predict_campaign(validated_data)
            
            # 3. Persistence Layer: Save the record to database
            PredictionRecord.objects.create(
                user=request.user,
                # Feature Inputs
                budget=validated_data['budget'],
                industry=validated_data['industry'],
                target_age_group=validated_data['target_age_group'],
                campaign_goal=validated_data['campaign_goal'],
                impressions=validated_data['impressions'],
                clicks=validated_data['clicks'],
                conversions=validated_data['conversions'],
                engagement_rate=validated_data['engagement_rate'],
                cost_per_click=validated_data['cost_per_click'],
                # Results
                best_platform=prediction["best_platform"],
                confidence=prediction["confidence"],
                ranking_data=prediction["ranking"]
            )
            
            # 4. Success Response
            return Response({
                "status": "success",
                "data": {
                    "best_platform": prediction["best_platform"],
                    "confidence": prediction["confidence"],
                    "ranking": prediction["ranking"]
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                "status": "error",
                "message": "Failed to process prediction.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PredictionHistoryView(APIView):
    """
    Returns the historical record of predictions for the authenticated user.
    """
    def get(self, request):
        records = PredictionRecord.objects.filter(user=request.user)
        serializer = PredictionHistorySerializer(records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DashboardStatsView(APIView):
    """
    Calculates live dashboard analytics from the prediction database.
    """
    def get(self, request):
        user_records = PredictionRecord.objects.filter(user=request.user)
        total = user_records.count()
        
        if total == 0:
            return Response({
                "total": 0,
                "avg_confidence": 0,
                "best_platform": "None"
            })
            
        avg_conf = user_records.aggregate(avg=Avg('confidence'))['avg']
        best_plat = user_records.values('best_platform').annotate(count=Count('best_platform')).order_by('-count')[0]['best_platform']
        
        return Response({
            "total": total,
            "avg_confidence": round(avg_conf * 100, 1),
            "best_platform": best_plat
        }, status=status.HTTP_200_OK)

class PredictionDetailView(APIView):
    """
    Retrieves the full metric payload for a single historical analysis.
    """
    def get(self, request, pk):
        try:
            record = PredictionRecord.objects.get(pk=pk, user=request.user)
            serializer = PredictionHistorySerializer(record)
            
            # Reconstruct the predictive ranking if necessary. 
            # In a real environment, we'd save the full ranking to the DB.
            # But for this implementation, we re-verify or return the base record.
            return Response({
                "status": "success",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        except PredictionRecord.DoesNotExist:
            return Response({"error": "Prediction not found."}, status=status.HTTP_404_NOT_FOUND)
