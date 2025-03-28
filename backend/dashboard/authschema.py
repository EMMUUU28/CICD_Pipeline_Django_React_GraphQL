import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class Query(graphene.ObjectType):
    me = graphene.Field(UserType)

    @login_required
    def resolve_me(self,info):
        user = info.context.user
        return user

class ObtainJSONWebToken(graphql_jwt.ObtainJSONWebToken):
    user = graphene.Field(UserType)

    @classmethod
    def resolve(cls,root,info,**kwargs):
        return cls(user=info.context.user)
    


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required = True)
        email = graphene.String(required =True)
        password = graphene.String(required=True)

    def mutate(self,info,username,email,password):
        user = User.objects.create_user(username=username, email=email, password=password)
        return CreateUser(user = user)
    
class UpdateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        email = graphene.String(required = True)
        password = graphene.String(required = True)

    def mutate(self,info,email,password):
        user = info.context.user 

        if user.is_anonymous:
            raise Exception("Not Logged in!")
        if email:
            user.email = email
        if password:
            user.set_password(password)
        user.save()

        return UpdateUser(user)

class DeleteUser(graphene.Mutation):
    ok = graphene.Boolean()

    def mutate(self,info):
        user = info.context.user
        if(user.is_anonymous):
            return Exception("User not Logged in.")
        user.delete()
        return DeleteUser(ok=True)

class AuthMutations(graphene.ObjectType):

    token_auth = ObtainJSONWebToken.Field()
    refresh_auth = graphql_jwt.Refresh.Field()
    create_user = CreateUser.Field() 
    update_user = UpdateUser.Field()
    delete_user = DeleteUser.Field()

schema = graphene.Schema(query=Query, mutation=AuthMutations)

