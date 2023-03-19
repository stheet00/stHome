<script>
import app  from '../../main.js'
import { Stack, Paper, Group, Text, Space, ActionIcon, Loader} from '@svelteuidev/core';
import { theme } from '@svelteuidev/core';
import LightBulb from '../icons/LightBulb.svelte';
import { CaretLeft, CaretRight, HamburgerMenu } from 'radix-icons-svelte';
import Slider from '@smui/slider';
import { MyXlCardShadow }  from '../../styles/default.js';

// example {key: "00-Wohn-L01", topic: "indb/hue", name : "Wohnen Decke", type : dim|onoff, status : true|false, level : 50}
export let values = [];
let selectorIndex = 0;

function onClickLightStateChange() {
    values[selectorIndex].status =  !values[selectorIndex].status;
    onSliderChange();
}

function onSliderChange() { 
    let routing = values[selectorIndex].topic;
    let target =  values[selectorIndex].key;
    let type = values[selectorIndex].type;
    let status = values[selectorIndex].status;
    let level = values[selectorIndex].level;
    let cmd
    if(type == "onoff") {
        cmd = { cmd : type, status : status}
    } else {
        cmd = { cmd : type, status : status, level : level}
    }
    app.uibSend(routing, target, cmd, "MyXlLight");
}

function lightSelectorFw() {
	if(selectorIndex == values.length-1) { selectorIndex = 0 }
    else { selectorIndex += 1; }
 }
 function lightSelectorBw() {
	if(selectorIndex == 0) { selectorIndex = values.length-1} 
    else { selectorIndex -= 1; }
 }
 
</script>

<Paper radius="md" withBorder override={MyXlCardShadow} >
    <Stack>
        <Group position='apart'>
            <Text weight={500} size='xl' position='right'>Licht</Text>
            <ActionIcon size={20} variant="light" ><HamburgerMenu size={20} /></ActionIcon>
        </Group>
        {#if values.length > 0}
            <ActionIcon size=130 on:click={onClickLightStateChange}>
                <Group position='center' direction="column">
                    <LightBulb size=130 color={values[selectorIndex].status == true ? theme.colors['yellow500'].value : "white" }/>
                    <Text size='sm'>{values[selectorIndex].status == true ? "On" : "Off"}</Text>
                </Group>
            </ActionIcon>
        
            <Space h={5} />
            {#if values[selectorIndex].type == "onoff"}
                <Group spacing="md" position='center' style="height:60px">
                </Group>
            {:else}
                <Group spacing="md" position='center' style="height:60px">
                    <Slider bind:value={values[selectorIndex].level} on:SMUISlider:change={onSliderChange}/>
                </Group>
            {/if}
            <Space h={5} />
            <Group position="center" spacing="xl" >
                <ActionIcon variant="light" on:click={lightSelectorBw}>
                    <CaretLeft size={20} />
                </ActionIcon>
                <div style="width:140px">
                    <Text size='lg' align='center'>{values[selectorIndex].name}</Text>
                </div>
                <ActionIcon  variant="light" on:click={lightSelectorFw}>
                    <CaretRight size={20} />
                </ActionIcon>
            </Group>
        {:else}
            <Space h={100} />
            <Group position="center" >
                <Loader variant='dots' color='gray' size='xl'/>
            </Group>
        {/if}
    </Stack>
</Paper>
