from rest_framework import serializers

class CodeExecutionSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)
    language = serializers.CharField(required=False, default='python')
