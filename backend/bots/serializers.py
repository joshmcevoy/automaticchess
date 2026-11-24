from django.forms.models import model_to_dict

def serializeBot(bot):
    return model_to_dict(bot)
