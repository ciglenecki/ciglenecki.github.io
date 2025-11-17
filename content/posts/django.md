+++
title = 'Django – Chained'
date = 2025-11-12T09:15:00+01:00
group = "programming"
+++

Everything I learned about Django which isn't mentioned in Django's docs, in some form or another.



### Don't use General Foreign Key (GFK)

unless: https://lukeplant.me.uk/blog/posts/avoid-django-genericforeignkey/#legitimate-uses

> The database schema resulting from use of GenericForeignKey is not great. I've heard it said, “data matures like wine, application code matures like fish”. Your database will likely outlast the application in its current incarnation, so it would be nice if it makes sense on its own, without needing the application code to understand what it is talking about.

> We have a big problem with referential integrity – namely, you have none. This is perhaps the biggest and most important problem. The consistency and integrity of data in a database is of first importance, and with GenericForeignKey you lose out massively compared to database foreign keys.

The alternative to GFK I prefer:

```py
class Job(models.Model):
    pass


class Video2VideoJob(models.Model):
    name = models.CharField()
    job_parent = models.OneToOneField(Job, on_delete=models.CASCADE)


class Image2VideoJob(models.Model):
    name = models.CharField()
    job_parent = models.OneToOneField(Job, on_delete=models.CASCADE)

```

Pros:
- no NULL fields
- DRY

Cons:
- requires modifying children
- performance -- querying on Job is required
- not obvious how to 

### Explicitly define all tables and their names

Prevent Django from creating hidden data tables. As Luke said, your DB will likely outlive your ORM. Furthermore, later down the line, your system might have services that want to process data (read/write) from DB tables. Do not let Django name your tables for you. 

(1) Use explicit `db_table` attribute (snakecase).

```py
class Book(models.Model):
    title = models.CharField(max_length=200)
    
    class Meta:
        db_table = 'custom_book_table'
```

(2) When using Many-To-Many, create explicit [`through`](https://docs.djangoproject.com/en/5.2/ref/models/fields/#django.db.models.ManyToManyField.through) table


### Django Agent instructions


```
# Django Coding Convention

## Environment

- Django <____>
- Django REST Framework (DRF) <____>
- Django Q2 for task queuing, scheduling, and async tasks
- PostgreSQL
- drf-spectacular
- PyJWT
- django-taggit
- django-imagekit

## General Guidelines

- For ForeignKey / ManyToManyField / OneToOneField, pass the model class, not a string. Do not set related_name.
- Follow Django norms: Don't Repeat Yourself, keep logic in models/serializers, keep views thin.
- Prefer GenericAPIView over APIView and ModelViewSet.
- Use DRF serializers for all validation/serialization.Keep views focused on business logic and response handling.
- Utilize Django's ORM effectively and avoid raw SQL queries unless absolutely necessary for performance.
- Leverage Django’s security features (CSRF, XSS protections, etc.).
- Prevent N+1 queries
  - `select_related` for foreign keys and one-to-one relationships
  - `prefetch_related` for many-to-many and reverse foreign key relationships

## QuerySets & Managers

- Put common filters in a custom manager/queryset (.active(), .for_user(user)).
- Always annotate expensive aggregations in the queryset, not in views.

## Testing

- Test file names should follow the `test_*.py` pattern.
- Aim for high test coverage. Every model, serializer, and view should have corresponding tests.
- Write atomic tests that focus on a single piece of functionality.
- Mock external services and dependencies (e.g., S3, payment gateways) using `unittest.mock`.
```