<script>
	/** This .svelte file is the master, top-level App. Use it to define everything else.
	 * It is treated as a module so no need to 'use strict' and you can use the import statement.
	 * This app is based on the sveltejs/template package.
	 */

	import { onMount } from 'svelte'
	import { SvelteUIProvider } from '@svelteuidev/core';
	import MyXlBulb from './components/MyXlBulb/MyXlBulb.svelte';
	import { SimpleGrid, Stack, Space } from '@svelteuidev/core';
	import Carousel from 'svelte-carousel';
	

	// These are "props" - variables that can be used in a parent component when mounting this component & used in the UI
	export let uibsend
	export let nrMsg = ''
	export let myGreeting = 'Hello there from App.svelte! Send me a msg containing msg.greeting to replace this text.'

	// Only runs when this component is being mounted (e.g. once, when the page is loaded)
    onMount(() => {
		// Start up the uibuilderfe library
        uibuilder.start()

		// A convenient send function that can be wired direct to events - defined as a prop above
		uibsend = uibuilder.eventSend

		// Listen for new messages from Node-RED/uibuilder
        uibuilder.onChange('msg', function(msg){
            console.info('msg received from Node-RED server:', msg)
			// Push an HTML highlighted visualisation of the msg to a prop so we can display it
            nrMsg = syntaxHighlight(msg)
			// Update the greeting if present in the msg
			if ( msg.greeting ) myGreeting = msg.greeting
        })

    }) // --- End of onMount --- //
</script>

<main>
	<SvelteUIProvider withNormalizeCSS withGlobalStyles themeObserver={'dark'}>
		<Carousel>
			<SimpleGrid cols={3} override={{margin:5}}>
				<MyXlBulb />
				<div>2</div>
				<div>3</div>
			</SimpleGrid>
				
			<SimpleGrid cols={3} override={{margin:5}}>
				<div>4</div>
				<div>5</div>
				<div>6</div>
			</SimpleGrid>
		</Carousel>
	</SvelteUIProvider>
</main>

<style>
	/* These styles will be constrained just to this component by Svelte.
	 * Use the dist/global.css file for any definitions you want shared by all components.
	 *   That is a good place to import uibuilder's uib-styles.css for example.
	 *   If you do, then you can use the CSS variables defined there in here as shown.
	 */
	
	main {
		text-align: center;
		padding: 1em;
		max-width: 1024px;
		max-height:550px;
		margin: 0 auto;
	}
</style>