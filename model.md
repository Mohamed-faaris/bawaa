# Model reference

for convex modeling

## Customer app

### account

- main user can login using number and OTP

fields:

- id: int
- number: string (required)
- email: string
- password: string
- address: string

### account_meta

fields:

- account_id: int
- address: string
- setting: json
- preference: json

### profile

fields:

- id: int
- account_id: int
- name: string
- avatar: string
- age: int
- relationship_status: string

### orders

fields:

- id: int
- profile_id: int
- prescription: image
- status: ordered | processing | ready | out_for_delivery | delivered
- created_at: datetime
- updated_at: datetime

## Admin app (panel/app)

- No user account. Use a shared secret in app and DB.
- Authenticate admin users with this secret.
- Base64 encode the random secret and send in header for authentication.

## Driver app

- Not needed now.
