from allauth.account.adapter import DefaultAccountAdapter

class CustomAccountAdapter(DefaultAccountAdapter):
    
    def save_user(self, request, user, form, commit=False):
        creator = super().save_user(request, user, form, commit)
        data = form.cleaned_data
        creator.first_name = data.get('first_name')
        creator.last_name = data.get('last_name')
        creator.phone = data.get('phone')
        creator.dateOfBirth = data.get('dateOfBirth')
        creator.location = data.get('location')
        creator.save()
        return creator