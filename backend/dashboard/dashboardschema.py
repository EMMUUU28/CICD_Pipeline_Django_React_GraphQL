import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from .models import Product,Category

class ProductType(DjangoObjectType):
    class Meta: 
        model = Product
        fields = "__all__"

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = "__all__"


#Query
class Query(graphene.ObjectType):
    all_categories = graphene.List(CategoryType)
    category_by_id = graphene.Field(CategoryType , id = graphene.Int(required = True))

    all_products = graphene.List(ProductType)
    product_by_id = graphene.Field(ProductType, id = graphene.Int( required = True ))

    product_by_category = graphene.Field(ProductType , category_id = graphene.Int(required=True))


    def resolve_all_categories(self,info):
        return Category.objects.all()
    
    def resolve_category_by_id(self,info,id):
        return Category.objects.get(id=id)
    
    def resolve_all_products(self,info):
        return Product.objects.all()
    
    def resolve_product_by_id(self,info,id):
        return Product.objects.get(id=id)
    
    def resolve_product_by_category(self,info, category_id):
        return Product.objects.filter(category_id= category_id)
    

#Mutation

class CreateCategory(graphene.Mutation):

    category = graphene.Field(CategoryType)

    class Arguments:
        name = graphene.String(required = True)
        description = graphene.String(required = True )

    @classmethod
    def mutate(cls,root,info, name, description ):
        category = Category.objects.create(
            name = name,
            description = description
        )
        return CreateCategory(category = category)
    
class CreateProduct(graphene.Mutation):
    product = graphene.Field(ProductType)

    class Arguments:
        name = graphene.String(required = True)
        description = graphene.String(required = True )
        price = graphene.Decimal(required = True )
        category_id = graphene.Int(required = True)
        inventory_quantity = graphene.Int(required = True)
        is_published = graphene.Boolean(required = True)

    @classmethod 
    def mutate(cls,root, info , name, description, price, category_id, inventory_quantity, is_published):

        category = Category.objects.get(pk = category_id)
        product = Product.objects.create(
            name= name , 
            description = description,
            price = price , 
            category = category,
            inventory_quantity = inventory_quantity,
            is_published = is_published

        )

        return CreateProduct(product = product)


class DashboardMutation(graphene.ObjectType):
    create_category = CreateCategory.Field()
    create_product = CreateProduct.Field()

schema = graphene.Schema(query=Query, mutation=DashboardMutation)
