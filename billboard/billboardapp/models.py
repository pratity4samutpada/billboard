from django.db import models

# Create your models here.
class Post(models.Model):
    post_title = models.CharField(max_length=80)
    post_author = models.CharField(max_length=20)
    date_posted = models.DateTimeField()
    post_content = models.CharField(max_length=1000)

    def __str__(self):
        return str(self.post_title) + " by " + str(self.post_author)


class Comment(models.Model):
    comment_author = models.CharField(max_length=20)
    comment_date = models.DateTimeField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment_content = models.CharField(max_length=300)

    def __str__(self):
        return "Comment by "+ str(self.comment_author)

