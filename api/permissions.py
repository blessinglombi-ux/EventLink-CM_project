from rest_framework.permissions import BasePermission
class IsOrganizer(BasePermission):
    """
    Allows access only to authenticated organizers.
    """
    message = "Organizer access is required."
    def has_permission(
        self,
        request,
        view
    ):
        return (
            request.user.is_authenticated
            and hasattr(
                request.user,
                "organizer_profile"
            )
        )
class IsParticipant(BasePermission):
    """
    Allows access only to authenticated participants.
    """
    message = "Participant access is required."
    def has_permission(
        self,
        request,
        view
    ):
        return (
            request.user.is_authenticated
            and hasattr(
                request.user,
                "participant_profile"
            )
        )
class IsOwnerOrReadOnly(BasePermission):
    """
    Object owner can modify the object.
    Other authenticated users can only read it.
    """
    def has_object_permission(
        self,
        request,
        view,
        obj
    ):
        if request.method in (
            "GET",
            "HEAD",
            "OPTIONS",
        ):
            return True
        owner = getattr(
            obj,
            "organizer",
            None
        )
        return owner == request.user