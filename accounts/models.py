from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):

    def create_user(self, email, name, password, role="user"):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user  = self.model(email=email, name=name, role=role)
        user.set_password(password)   # hashes the password — never stored as plain text
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password):
        return self.create_user(email, name, password, role="admin")


class User(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = [("admin", "Admin"), ("user", "User")]

    email      = models.EmailField(unique=True)
    name       = models.CharField(max_length=100)
    role       = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    is_active  = models.BooleanField(default=True)
    is_staff   = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD  = "email"       # login field is email, not username
    REQUIRED_FIELDS = ["name"]

    objects = UserManager()

    def __str__(self):
        return f"{self.name} ({self.email})"