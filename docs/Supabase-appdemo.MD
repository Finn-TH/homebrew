Set up a login page#
Login and Signup form#
Create a login/signup page for your application:

JavaScript

TypeScript
Create a new folder named login, containing a page.tsx file with a login/signup form.

app/login/page.tsx

import { login, signup } from './actions'

export default function LoginPage() {
return (

<form>
<label htmlFor="email">Email:</label>
<input id="email" name="email" type="email" required />
<label htmlFor="password">Password:</label>
<input id="password" name="password" type="password" required />
<button formAction={login}>Log in</button>
<button formAction={signup}>Sign up</button>
</form>
)
}
View source
Navigate to http://localhost:3000/login. You should see your login form, but it's not yet hooked up to the actual login function. Next, you need to create the login/signup actions. They will:

Retrieve the user's information.
Send that information to Supabase as a signup request, which in turns will send a confirmation email.
Handle any error that arises.
Note that cookies is called before any calls to Supabase, which opts fetch calls out of Next.js's caching. This is important for authenticated data fetches, to ensure that users get access only to their own data.

See the Next.js docs to learn more about opting out of data caching.

JavaScript

TypeScript

app/login/actions.ts
app/error/page.tsx

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
const supabase = await createClient()

// type-casting here for convenience
// in practice, you should validate your inputs
const data = {
email: formData.get('email') as string,
password: formData.get('password') as string,
}

const { error } = await supabase.auth.signInWithPassword(data)

if (error) {
redirect('/error')
}

revalidatePath('/', 'layout')
redirect('/account')
}

export async function signup(formData: FormData) {
const supabase = await createClient()

// type-casting here for convenience
// in practice, you should validate your inputs
const data = {
email: formData.get('email') as string,
password: formData.get('password') as string,
}

const { error } = await supabase.auth.signUp(data)

if (error) {
redirect('/error')
}

revalidatePath('/', 'layout')
redirect('/account')
}
View sources
When you enter your email and password, you will receive an email with the title Confirm Your Signup. Congrats 🎉!!!

Email template#
Change the email template to support a server-side authentication flow.

Before we proceed, let's change the email template to support sending a token hash:

Go to the Auth templates page in your dashboard.
Select Confirm signup template.
Change {{ .ConfirmationURL }} to {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email.
Did you know? You could also customize emails sent out to new users, including the email's looks, content, and query parameters. Check out the settings of your project.

Confirmation endpoint#
As we are working in a server-side rendering (SSR) environment, it is necessary to create a server endpoint responsible for exchanging the token_hash for a session.

In the following code snippet, we perform the following steps:

Retrieve the code sent back from the Supabase Auth server using the token_hash query parameter.
Exchange this code for a session, which we store in our chosen storage mechanism (in this case, cookies).
Finally, we redirect the user to the account page.

JavaScript

TypeScript
app/auth/confirm/route.ts

import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
const { searchParams } = new URL(request.url)
const token_hash = searchParams.get('token_hash')
const type = searchParams.get('type') as EmailOtpType | null
const next = '/account'

// Create redirect link without the secret token
const redirectTo = request.nextUrl.clone()
redirectTo.pathname = next
redirectTo.searchParams.delete('token_hash')
redirectTo.searchParams.delete('type')

if (token_hash && type) {
const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      redirectTo.searchParams.delete('next')
      return NextResponse.redirect(redirectTo)
    }

}

// return the user to an error page with some instructions
redirectTo.pathname = '/error'
return NextResponse.redirect(redirectTo)
}
View source
Account page#
After a user is signed in we can allow them to edit their profile details and manage their account.

Let's create a new component for that called AccountForm within the app/account folder.

JavaScript

TypeScript
app/account/account-form.tsx

'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'

// ...

export default function AccountForm({ user }: { user: User | null }) {
const supabase = createClient()
const [loading, setLoading] = useState(true)
const [fullname, setFullname] = useState<string | null>(null)
const [username, setUsername] = useState<string | null>(null)
const [website, setWebsite] = useState<string | null>(null)
const [avatar_url, setAvatarUrl] = useState<string | null>(null)

const getProfile = useCallback(async () => {
try {
setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }

}, [user, supabase])

useEffect(() => {
getProfile()
}, [user, getProfile])

async function updateProfile({
username,
website,
avatar_url,
}: {
username: string | null
fullname: string | null
website: string | null
avatar_url: string | null
}) {
try {
setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }

}

return (

<div className="form-widget">

      {/* ... */}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ fullname, username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>

)
}
View source
Create an account page for the AccountForm component we just created

JavaScript

TypeScript
app/account/page.tsx

import AccountForm from './account-form'
import { createClient } from '@/utils/supabase/server'

export default async function Account() {
const supabase = await createClient()

const {
data: { user },
} = await supabase.auth.getUser()

return <AccountForm user={user} />
}
View source
Sign out#
Let's create a route handler to handle the signout from the server side. Make sure to check if the user is logged in first!

JavaScript

TypeScript
app/auth/signout/route.ts

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
const supabase = await createClient()

// Check if a user's logged in
const {
data: { user },
} = await supabase.auth.getUser()

if (user) {
await supabase.auth.signOut()
}

revalidatePath('/', 'layout')
return NextResponse.redirect(new URL('/login', req.url), {
status: 302,
})
}
View source
Launch!#
Now that we have all the pages, route handlers and components in place, let's run this in a terminal window:

npm run dev

And then open the browser to localhost:3000 and you should see the completed app.
