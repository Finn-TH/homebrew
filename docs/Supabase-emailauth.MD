Password-based Auth
Allow users to sign in with a password connected to their email or phone number.
Users often expect to sign in to your site with a password. Supabase Auth helps you implement password-based auth safely, using secure configuration options and best practices for storing and verifying passwords.

Users can associate a password with their identity using their email address or a phone number.

With email#
Enabling email and password-based authentication#
Email authentication is enabled by default.

You can configure whether users need to verify their email to sign in. On hosted Supabase projects, this is true by default. On self-hosted projects or in local development, this is false by default.

Change this setting on the Auth Providers page for hosted projects, or in the configuration file for self-hosted projects.

Signing up with an email and password#
There are two possible flows for email signup: implicit flow and PKCE flow. If you're using SSR, you're using the PKCE flow. If you're using client-only code, the default flow depends upon the client library. The implicit flow is the default in JavaScript and Dart, and the PKCE flow is the default in Swift.

The instructions in this section assume that email confirmations are enabled.

Implicit flow

PKCE flow
The PKCE flow allows for server-side authentication. Unlike the implicit flow, which directly provides your app with the access token after the user clicks the confirmation link, the PKCE flow requires an intermediate token exchange step before you can get the access token.

Step 1: Update signup confirmation email
Update your signup email template to send the token hash. See Email Templates for how to configure your email templates.

Your signup email template should contain the following HTML:

<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email"
    >Confirm your email</a
  >
</p>

Step 2: Create token exchange endpoint
Create an API endpoint at <YOUR_SITE_URL>/auth/confirm to handle the token exchange.

Make sure you're using the right supabase client in the following code.

If you're not using Server-Side Rendering or cookie-based Auth, you can directly use the createClient from @supabase/supabase-js. If you're using Server-Side Rendering, see the Server-Side Auth guide for instructions on creating your Supabase client.

Next.js

SvelteKit

Astro

Remix

Express
Create a new file at app/auth/confirm/route.ts and populate with the following:

app/auth/confirm/route.ts

import { type EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
const { searchParams } = new URL(request.url)
const token_hash = searchParams.get('token_hash')
const type = searchParams.get('type') as EmailOtpType | null
const next = searchParams.get('next') ?? '/'
const redirectTo = request.nextUrl.clone()
redirectTo.pathname = next

if (token_hash && type) {
const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      return NextResponse.redirect(redirectTo)
    }

}

// return the user to an error page with some instructions
redirectTo.pathname = '/auth/auth-code-error'
return NextResponse.redirect(redirectTo)
}
Step 3: Call the sign up function to initiate the flow

JavaScript

Dart

Swift

Kotlin

Python
To sign up the user, call signUp() with their email address and password:

async function signUpNewUser() {
const { data, error } = await supabase.auth.signUp({
email: 'example@email.com',
password: 'example-password',
})
}

Signing in with an email and password#

JavaScript

Dart

Swift

Kotlin

Python
When your user signs in, call signInWithPassword() with their email address and password:

async function signInWithEmail() {
const { data, error } = await supabase.auth.signInWithPassword({
email: 'example@email.com',
password: 'example-password',
})
}

Resetting a password#

Implicit flow

PKCE flow
The PKCE flow allows for server-side authentication. Unlike the implicit flow, which directly provides your app with the access token after the user clicks the confirmation link, the PKCE flow requires an intermediate token exchange step before you can get the access token.

Step 1: Update reset password email
Update your reset password email template to send the token hash. See Email Templates for how to configure your email templates.

Your signup email template should contain the following HTML:

<h2>Reset Password</h2>

<p>Follow this link to reset the password for your user:</p>
<p>
  <a
    href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/account/update-password"
    >Reset Password</a
  >
</p>

Step 2: Create token exchange endpoint
Create an API endpoint at <YOUR_SITE_URL>/auth/confirm to handle the token exchange.

Make sure you're using the right supabase client in the following code.

If you're not using Server-Side Rendering or cookie-based Auth, you can directly use the createClient from @supabase/supabase-js. If you're using Server-Side Rendering, see the Server-Side Auth guide for instructions on creating your Supabase client.

Next.js

SvelteKit

Astro

Remix

Express
Create a new file at app/auth/confirm/route.ts and populate with the following:

app/auth/confirm/route.ts

import { type EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
const { searchParams } = new URL(request.url)
const token_hash = searchParams.get('token_hash')
const type = searchParams.get('type') as EmailOtpType | null
const next = searchParams.get('next') ?? '/'
const redirectTo = request.nextUrl.clone()
redirectTo.pathname = next

if (token_hash && type) {
const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      return NextResponse.redirect(redirectTo)
    }

}

// return the user to an error page with some instructions
redirectTo.pathname = '/auth/auth-code-error'
return NextResponse.redirect(redirectTo)
}
Step 3: Call the reset password by email function to initiate the flow

JavaScript

Swift

Kotlin

Python
async function resetPassword() {
const { data, error } = await supabase.auth.resetPasswordForEmail(email)
}

Once you have a session, collect the user's new password and call updateUser to update their password.

JavaScript

Swift

Kotlin

Python
await supabase.auth.updateUser({ password: new_password })

Email sending#
The signup confirmation and password reset flows require an SMTP server to send emails.

The Supabase platform comes with a default email-sending service for you to try out. The service has a rate limit of 2 emails per hour, and availability is on a best-effort basis. For production use, you should consider configuring a custom SMTP server.

Consider configuring a custom SMTP server for production.

See the Custom SMTP guide for instructions.

Local development with Inbucket#
You can test email flows on your local machine. The Supabase CLI automatically captures emails sent locally by using Inbucket.

In your terminal, run supabase status to get the Inbucket URL. Go to this URL in your browser, and follow the instructions to find your emails.
