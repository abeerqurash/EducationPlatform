# Batch 39 — Publication Action Reason

Batch 39 replaces the generic browser-generated publication reason with an
optional operator-entered reason.

The Admin publication action component now:
- provides a clearly labelled Action reason field;
- limits the browser field to the existing server maximum of 1000 characters;
- trims the value before sending it;
- omits the reason field entirely when it is blank;
- keeps the reason available through the existing Submit for review and
  Publish confirmation flows.

The server action continues to independently validate the reason type and
maximum length. The browser field is usability only and is not trusted as a
security boundary.

The existing trusted publication persistence already records a supplied reason
in its audit metadata, so this batch does not require a schema or persistence
change.

No RBAC permission, publication policy, editorial gate, verification status,
review record, source record or formula is changed.
