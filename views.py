from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import RegistrationForm, LoginForm, UserUpdateForm, ProfileUpdateForm

def register_view(request):
    if request.user.is_authenticated:
        return redirect('dashboards:redirect')

    initial_role = request.GET.get('role', 'participant')
    if initial_role not in ['organizer', 'participant']:
        initial_role = 'participant'

    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f"Welcome to EventLink CM, {user.username}!")
            if user.is_organizer:
                return redirect('dashboards:organizer')
            return redirect('dashboards:participant')
    else:
        form = RegistrationForm(initial={'role': initial_role})

    return render(request, 'accounts/register.html', {'form': form, 'selected_role': initial_role})

def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboards:redirect')

    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f"Welcome back, {user.first_name or user.username}!")
                next_url = request.GET.get('next')
                if next_url:
                    return redirect(next_url)
                if user.is_organizer:
                    return redirect('dashboards:organizer')
                return redirect('dashboards:participant')
            else:
                messages.error(request, "Invalid username or password.")
    else:
        form = LoginForm()

    return render(request, 'accounts/login.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect('index')

@login_required
def profile_edit_view(request):
    user = request.user
    profile = user.profile

    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST, instance=user)
        p_form = ProfileUpdateForm(request.POST, request.FILES, instance=profile)
        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(request, "Your profile has been updated successfully!")
            if user.is_organizer:
                return redirect('dashboards:organizer')
            return redirect('dashboards:participant')
    else:
        u_form = UserUpdateForm(instance=user)
        p_form = ProfileUpdateForm(instance=profile)

    context = {
        'u_form': u_form,
        'p_form': p_form,
        'profile': profile,
    }
    return render(request, 'accounts/profile_edit.html', context)
