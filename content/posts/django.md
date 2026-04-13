+++
title = 'Django – Chained'
date = 2025-11-12T09:15:00+01:00
group = "programming"
+++

Everything I learned about Django which isn't mentioned in Django's docs, in some form or another.

## Fundamental advice

### Use one app

The biggest mistake you can make when creating a project/app/system is assuming you need to create three different Django apps because you have three different products under the same Django codebase. The data flow boundary is often not clear and predictable, especially in the early-mid stage when product and business requirements often change.

Let's say you define model `Entity` in App `A`. After some time, you realize it would be useful to use a feature from App `B` to transform an `Entity` in some way and then consumed by App `A`. You thought apps `A` and `B` are independent, when in fact `B` now depends on `A` because it modifies `Entity` defined in `A`. Are you fine with `B` being dependent on `A`? If not, you have to move `Entity` into a shared `core` app? Which entities will always live in `A`? Are you sure they will, or will you have to move them to `core` as well?

     
     
### Do not override `save()` or use signals, create `services` to abstract away the business logic.

Often, there's some repetitive business logic you need to perform. Let's assume your system can create and store an image in the database. Before saving the image, you want to resize it and ensure its resolution is below 1080p. The image can be created and saved in the database on different operational layers: direct user file upload (route), internal async task, or side-effect of another piece of code. How should you ensure that the image is resized before it's saved into the database?

```py
from django.db import models

class Image(models.Model):
    file = models.ImageField(upload_to="photos/")
```

❌ case 1: override image's `save()` function at the ORM level

```py
class Image(models.Model):
    file = models.ImageField(upload_to="photos/")

    def save(self, *args, **kwargs):
        # resize self.file here
        self.file = resize_to_fit(self.file)

        super().save(*args, **kwargs)
```

This will work, but it's a funky approach. You're defining a business logic in the Django Model class. You cannot easily extract your business logic from the Django code at a later point and easily move it to another ORM. This approach also clutters the Django Model class with important details that are sometimes hard to remember. I will explain how this is contrasted with case 3. Furthermore, in the client code, the developer now only sees `image.save()`. He might be unaware of the image resizing that occurs under the hood. He's **operating with incomplete business information**.

❌ case 2: signals
Seems cute and fun at first, but becomes a NIGHTMARE during a debugging session. You should avoid signals.

```py
class Image(models.Model):
    file = models.ImageField(upload_to="photos/")


@receiver(pre_save, sender=Image)
def resize_image_on_save(sender, instance, **kwargs):
    if instance.file:
        instance.file = ImageService.resize_to_fit(instance.file)
```
✅ case 3: defining a service

I do not want to define a service formally. It's a reusable piece of code, whose naming describes the business action. A service can be a file with functions, a module, a class with static methods or anything else.

Let us define an `ImageService`. It has a static function `resize_to_fit(image, res=1920*1080)`.

```py
class ImageService:
    @staticmethod
    def resize_to_fit(image: Image.Image, res: int = 1920 * 1080):
        # ... image resize logic ...
        return resized_image
# ...
image = ImageService.resize_to_fit(image, res=1920*1080)
image.save()
```

You might think that calling `resize_to_fit` each time before `save()` seems repetitive. It's not as bad as it seems. In fact, it has multiple advantages over other approaches.
1. You wrapped the business logic in the service's static method. You do not need to rewrite the business logic at multiple places you just need to call it.
2. Your code became self-documented. A developer looking at the code will explicitly see `image = ImageService.resize_to_fit(image, res=1920*1080)` followed by a `.save()`. He understands the image will be resized.
3. Your code stayed flexible. Your business logic changes. You might resize the image if it was uploaded by the user, but not if it was created by an image generation job. With this approach, you can directly alter the business logic at every level. In case (1), we would have to 

###  Don't use General Foreign Key (GFK)

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

###  Explicitly define all tables and their names

Prevent Django from creating hidden data tables. As Luke said, your DB will likely outlive your ORM. Furthermore, later down the line, your system might have services that want to process data (read/write) from DB tables. Do not let Django name your tables for you. 

(1) Use explicit `db_table` attribute (snakecase).

```py
class Book(models.Model):
    title = models.CharField(max_length=200)
    
    class Meta:
        db_table = 'custom_book_table'
```

(2) When using Many-To-Many, create explicit [`through`](https://docs.djangoproject.com/en/5.2/ref/models/fields/#django.db.models.ManyToManyField.through) table

## Helpful but not important
### Create `?include=` query param when dealing with deep objects

You are returning a `job`, it has expensive child field called `image_assets`. We do not want to fetch `images_assets` every time we fetch a job because it might hit the DB more times than necessary. 

Create a `IncludeMixin` for Views
- `allowed_includes`, lists the only accepted include tokens
- `select_related_map` maps an include token to one or more FK paths that
- `prefetch_related_map` maps an include token to one or more prefetch paths for reverse or many-to-many relations

```py
allowed_includes = {"job"}
select_related_map = {"job": ImageAsset.get_job_relation_names()}
prefetch_related_map = {"job": ("image_to_image_job__reference_images",)}
```

## Other

https://careersatdoordash.com/blog/tips-for-building-high-quality-django-apps-at-scale/


### Django skills

Add a link to skill files here. 