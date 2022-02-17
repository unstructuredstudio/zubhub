def notification_changed(obj, instance):
    changed = False

    if not obj.message == instance.message:
        changed = True
    elif not obj.recipient == instance.recipient:
        changed = True
    elif not obj.viewed == instance.viewed:
        changed = True

    return changed
