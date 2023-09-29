from django.test import TestCase
from django.contrib.auth import get_user_model
from projects.models import PublishingRule, Category, Project
from zubhub.creators.models import Creator


class PublishingRuleTest(TestCase):
    def test_model_fields(self):
        rule = PublishingRule(type=PublishingRule.DRAFT, publisher_id="test-publisher-id")
        rule.save()
        self.assertEqual(rule.type, PublishingRule.DRAFT)
        self.assertEqual(rule.publisher_id, "test-publisher-id")

    def test_model_str_representation(self):
        rule = PublishingRule(type=PublishingRule.DRAFT, publisher_id="test-publisher-id")
        rule.save()
        self.assertEqual(str(rule), "DRAFT")

class CategoryTest(TestCase):
    def test_model_fields(self):
        category = Category(name="test-category", description="test-description")
        category.save()
        self.assertEqual(category.name, "test-category")
        self.assertEqual(category.description, "test-description")

    def test_model_str_representation(self):
        category = Category(name="test-category", description="test-description")
        category.save()
        self.assertEqual(str(category), "test-category")

class ProjectTest(TestCase):
    def setUp(self):
        self.creator = Creator.objects.create(username="krishna")
        self.category = Category.objects.create(name="test-category")
        self.rule = PublishingRule.objects.create(type=PublishingRule.PUBLIC)
        self.project = Project.objects.create(
            creator=self.creator,
            title="test-project",
            description="test-description",
            materials_used="test-materials-used",
            category=self.category,
            publish=self.rule
        )

    def test_model_fields(self):
        self.assertEqual(self.project.creator, self.creator)
        self.assertEqual(self.project.title, "test-project")
        self.assertEqual(self.project.description, "test-description")
        self.assertEqual(self.project.materials_used, "test-materials-used")
        self.assertEqual(self.project.category, self.category)
        self.assertEqual(self.project.publish, self.rule)

    def test_model_str_representation(self):
        self.assertEqual(str(self.project), "test-project")
