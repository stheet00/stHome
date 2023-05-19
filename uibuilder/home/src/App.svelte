<script>
	/** This .svelte file is the master, top-level App. Use it to define everything else.
	 * It is treated as a module so no need to 'use strict' and you can use the import statement.
	 * This app is based on the sveltejs/template package.
	 */

	import { onMount } from 'svelte'
	import { ActionIcon, SvelteUIProvider } from '@svelteuidev/core';
	import { SimpleGrid, Group, Stack, Space, Divider} from '@svelteuidev/core';
	import Carousel from 'svelte-carousel';
    import MyXlClimate from './components/MyXlClimate/MyXlClimate.svelte';
    import { getMyXlClimateData } from './data/MyClimateData';
	import MyXlLight from './components/MyXlLight/MyXlLight.svelte';
	import { getMyXlLightData } from './data/MyLightData';
    import MyXlPower from './components/MyXlPower/MyXlPower.svelte';
	import { getMyXlPowerManData } from './data/MyPowerManData';
	import MyXlWndDoor from './components/MyXlWndDoor/MyXlWndDoor.svelte';
	import { getMyXlWndDoorData } from './data/MyWndDoorData';
	import { Gear, Home } from 'radix-icons-svelte';
	import collapse from 'svelte-collapse'
	import MySettings from './components/MySettings/MySettings.svelte';
	
	export function uibSend(routing, target, command, source) {
		let cmdSend =  { routing: routing, target : target, command : command, source : source };
		console.info('cmd send to Node-RED server:', cmdSend)
		uibuilder.send(cmdSend);
	}

	export function getInDbData() {
		return InDbData;
	}
	
	let InDbData = {};
	let MyXlClimateData = [];
	let MyXlLightData = [];
	let MyXlPowerManData = [];
	let MyXlWndDoorData = [];

	// Only runs when this component is being mounted (e.g. once, when the page is loaded)
    onMount(() => {
		// Start up the uibuilderfe library
        uibuilder.start()

		// Listen for new messages from Node-RED/uibuilder
        uibuilder.onChange('msg', function(msg){
            console.info('msg received from Node-RED server:', msg)

			let topic = msg.topic;

			msg.payload.forEach((e) => {
				if(topic == "indb/globalParam") {
					let key = topic+"/"+e._measurement;
					InDbData[key] = { _measurement : e._measurement, orig : e };
				}			
				if(topic == "indb/homematic") {
					let key = topic+"/"+e._measurement+"/"+e.name;
					InDbData[key] = { name : e.name, _measurement : e._measurement, _value : e._value, _time : e._time,
					topic : topic};
				}	
				if(topic == "indb/hue") {
					let key = topic+"/"+e._measurement+"/"+e.type+"/"+e.name;
					InDbData[key] = { name : e.name, _measurement : e._measurement, _value : e.value, type : e.type,
						level : e.level, color : e.color, _time : e._time, topic : topic};
				}
				if(topic == "indb/powerman") {
					let key = topic+"/"+e._measurement+"/"+e.type+"/"+e.instance;
					InDbData[key] = { _measurement : e._measurement, _value : e._value, type : e.type,
						 _time : e._time, topic : topic};
				}
			});

			MyXlClimateData = getMyXlClimateData(InDbData);
			MyXlLightData = getMyXlLightData(InDbData);
			MyXlPowerManData = getMyXlPowerManData(InDbData);
			MyXlWndDoorData = getMyXlWndDoorData(InDbData);
			
			console.info('inDbData object', InDbData);
        })
    }) // --- End of onMount --- //

	let navi = "home"
</script>

<main>
	<SvelteUIProvider withNormalizeCSS withGlobalStyles themeObserver={'dark'}>
		<Group position='left' direction="row" spacing="lg">
			<Space w={20}/>
			<ActionIcon on:click={() => {navi = "home"}}>
				<Home color="white" size=24/>
			</ActionIcon>
			<ActionIcon on:click={() => {navi = "settings"}}>
				<Gear color="white" size=24/>
			</ActionIcon>
			<Space h={20}/>
		</Group>
		<div use:collapse={{ open: navi == "home" ? true : false, duration: 0.1 }}>
			<Carousel>
				<SimpleGrid cols={3} override={{margin:5}} spacing={3}>
					<MyXlClimate values={MyXlClimateData}/>
					<MyXlLight values={MyXlLightData}/>
					<MyXlWndDoor values={MyXlWndDoorData}/> 
				</SimpleGrid>
					
				<SimpleGrid cols={3} override={{margin:5}}>
					<MyXlPower values={MyXlPowerManData}/>
					
					<div>5</div>
					<div>6</div>
				</SimpleGrid>
			</Carousel>
		</div>
		<div style="margin-left:45px;margin-top:5px"
		     use:collapse={{ open: navi == "settings" ? true : false, duration: 0.1 }}>
			<MySettings reload = { navi == "settings" ? true : false }/>
		</div>
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