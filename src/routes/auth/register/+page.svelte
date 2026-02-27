<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<h1>Register</h1>
<form method="post" action="?/signUpEmail" use:enhance>
	<label>
		Name
		<input name="name" value={form?.name ?? ''} />
	</label>
	<label>
		Email
		<input type="email" name="email" value={form?.email ?? data.email ?? ''} />
	</label>
	<label>
		Password
		<input type="password" name="password" />
	</label>
	<label>
		Confirm Password
		<input type="password" name="confirmPassword" />
	</label>
	<button>Register</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
