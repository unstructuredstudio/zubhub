import time
from random import randint
from locust import HttpUser, task, between

project_ids = [
    'bd40da9e-fd48-4552-888a-1fdad9b885d0',
    'c43710a8-eebb-439c-a2f1-af9e67818b2c',
    '61045c12-6eae-4678-abda-4f62161a2a8a',
    '3641f9b9-9839-4fcd-bc74-31afe87f6b23',
    '692fd910-4c5b-4f7a-ba31-7f8e5bbf82f8',
    '485a9dac-570d-4ab6-9ed2-dec188c5ebee',
    'ca618a30-564a-423e-8bbc-a725753addb8',
    '5cbf2541-cfd3-40f1-aefd-6729c0b5dbe2',
    '29cd10be-daa0-4ed9-a2b9-b741d4610b0a',
    '13b1e4b7-1eae-42c0-8ac4-f6a65ebbbf92',
    'd5bb27b5-c87b-471a-a034-8245f6e067a1',
    '0848243c-5381-45f3-bacb-e60c58fdda73'
]


class QuickstartUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def hello_world(self):
        self.client.get("/api/projects")

    @task(3)
    def view_item(self):
        for project_id in project_ids:
            self.client.get(f"/api/projects/{project_id}", name="/projects")
            time.sleep(randint(1, 5))
