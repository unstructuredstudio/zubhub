from allauth.account.adapter import DefaultAccountAdapter

class CustomAccountAdapter(DefaultAccountAdapter):

    def save_user(self, request, user, form, commit=False):
        creator = super().save_user(request, user, form, commit)
        data = form.cleaned_data
        location = Location.objects.get(name=data.get('location'))

        creator.dateOfBirth = data.get('dateOfBirth')
        creator.location = location
        creator.save()
        return creator