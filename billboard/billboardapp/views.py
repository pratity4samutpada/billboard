from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .models import Post,Comment
from datetime import datetime


def index(request):
    post_list = Post.objects.order_by('-date_posted').reverse()
    template = loader.get_template('billboardapp/index.html')
    context = {
        'post_list': post_list,
        'current_time': datetime.now()
    }
    return HttpResponse(template.render(context, request))


def newpost(request):
    title = request.POST.get('post_title')
    author = request.POST.get('post_author')
    content = request.POST.get('post_content')
    new_post = Post(post_title=title, post_author=author, post_content=content, date_posted=datetime.now())
    new_post.save()
    context = {'new_post': new_post}
    return render(request, 'billboardapp/newpost.html', context)

def newcomment(request):
    post_id= int(request.POST.get('post_id'))
    author = request.POST.get('comment_author')
    content = request.POST.get('comment_content')
    post = Post.objects.get(pk=post_id)
    new_comment = Comment(post=post, comment_author=author,comment_content=content,comment_date=datetime.now())
    new_comment.save()
    context = {'new_comment': new_comment}
    return render(request, 'billboardapp/newcomment.html', context)