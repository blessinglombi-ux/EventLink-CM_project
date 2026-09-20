from django.http import HttpResponse


def home(request):
    return HttpResponse(
        """
        <h1>EventLink CM</h1>
        <p>Connecting organizers with participants.</p>
        """
    )