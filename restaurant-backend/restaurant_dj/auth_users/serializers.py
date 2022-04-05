from rest_framework import serializers

from auth_users.models import User


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['id']
        write_only_fields = ['password']

    def create(self, validated_data):
        return User.objects.create_user(validated_data['email'], validated_data['first_name'], validated_data['last_name'],
                                 validated_data['password'])



