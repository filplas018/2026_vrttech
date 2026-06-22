from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0005_alter_user_status_emoji"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="avatar",
        ),
    ]
