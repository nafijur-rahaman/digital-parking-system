from django.core.management.base import BaseCommand
from users.models import CustomUser
import random
from django.db import transaction

class Command(BaseCommand):
    help = 'Seeds the database with Dummy University Users (Students, Faculty, Staff)'

    def handle(self, *args, **kwargs):
        roles = ['student', 'faculty', 'staff']
        first_names = ['John', 'Jane', 'Alex', 'Chris', 'Katie', 'Mike', 'Sarah', 'David', 'Laura', 'Robert', 'Emily', 'Michael']
        last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
        years = ['2023', '2024']

        users_to_create = []
        
        # Keep track of generated IDs to prevent duplicates
        generated_ids = set(CustomUser.objects.exclude(university_id__isnull=True).values_list('university_id', flat=True))

        for role in roles:
            for i in range(10):
                # Generate unique ID starting with 2023 or 2024
                while True:
                    year = random.choice(years)
                    # For example: 20240001
                    unique_part = f"{random.randint(1000, 9999)}"
                    uni_id = f"{year}{unique_part}"
                    if uni_id not in generated_ids:
                        generated_ids.add(uni_id)
                        break
                
                f_name = random.choice(first_names)
                l_name = random.choice(last_names)
                full_name = f"{f_name} {l_name}"
                username = f"{f_name.lower()}_{l_name.lower()}_{uni_id}"
                email = f"{username}@university.edu"
                phone = f"+1{random.randint(1000000000, 9999999999)}"

                user = CustomUser(
                    username=username,
                    full_name=full_name,
                    email=email,
                    phone=phone,
                    role=role,
                    university_id=uni_id
                )
                user.set_password('university123')
                users_to_create.append(user)

        try:
            with transaction.atomic():
                CustomUser.objects.bulk_create(users_to_create)
            self.stdout.write(self.style.SUCCESS('Successfully seeded 30 university users!'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to seed users: {e}'))
