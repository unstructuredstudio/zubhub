from celery import shared_task
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from zubhub import settings

@shared_task(name="zubhub.tasks.send_activation_email", bind=True)
def send_activation_email(self, email_to, context):
  email_content = render_to_string("email/activate_account.html", context)
  mail = EmailMessage(
    "Activate Your Account!",
    email_content,
    settings.DEFAULT_FROM_EMAIL,
    [email_to]
  )
  mail.content_subtype = "html"
  return mail.send()

@shared_task(name="zubhub.tasks.send_password_reset_email", bind=True)
def send_password_reset_email(self, email_to, context):
  email_content = render_to_string("email/password_reset.html", context)
  mail = EmailMessage(
    "Reset Your Password",
    email_content,
    settings.DEFAULT_FROM_EMAIL,
    [email_to]
  )
  mail.content_subtype = "html"
  return mail.send()

@shared_task(name="zubhub.tasks.send_bookmark_notification_email", bind=True)
def send_bookmark_notification_email(self, email_to, context):
  email_content = render_to_string("email/bookmark.html", context)
  mail = EmailMessage(
    "You've been bookmarked!",
    email_content,
    settings.DEFAULT_FROM_EMAIL,
    [email_to]
  )
  mail.content_subtype = "html"
  return mail.send()

@shared_task(name="zubhub.tasks.send_badge_notification_email", bind=True)
def send_badge_notification_email(self, email_to, context):
  email_content = render_to_string("email/badge.html", context)
  mail = EmailMessage(
    "You got a new badge!",
    email_content,
    settings.DEFAULT_FROM_EMAIL,
    [email_to]
  )
  mail.content_subtype = "html"
  return mail.send()

@shared_task(name="zubhub.tasks.send_comment_notification_email", bind=True)
def send_comment_notification_email(self, email_to, context):
  email_content = render_to_string("email/comment.html", context)
  mail = EmailMessage(
    "You got a comment!",
    email_content,
    settings.DEFAULT_FROM_EMAIL,
    [email_to],
  )
  mail.content_subtype = "html"
  return mail.send()


@shared_task(name="zubhub.tasks.send_follower_notification_email", bind=True)
def send_follower_notification_email(self, email_to, context):
  email_content = render_to_string("email/follower.html", context)
  mail = EmailMessage(
    "You have a new follower!",
    email_content,
    settings.DEFAULT_FROM_EMAIL,
    [email_to]
  )
  mail.content_subtype = "html"
  return mail.send()