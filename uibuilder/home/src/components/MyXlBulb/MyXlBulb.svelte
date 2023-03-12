<script>
import { Stack, Paper, Group, Text, Switch, Space, ActionIcon} from '@svelteuidev/core';
import { theme } from '@svelteuidev/core';
import LightBulb from '../icons/LightBulb.svelte';
import { CaretLeft, CaretRight, HamburgerMenu } from 'radix-icons-svelte';
import Slider from '@smui/slider';
import { onMount } from 'svelte';

const MyXlCardShadow = {
        '$$gray': theme.colors['gray200'].value,
        boxShadow: '0 1px 2px $$gray',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            boxShadow: '0 1px 3px $$gray',
        }};

let lights = [{name : "Wohnen HUE", type : "dim", status : true, level : 50},
              {name : "Bad HUE", type : "dim" , status : false, level : 40},
              {name : "Kind HUE", type : "dim" , status : true, level : 80},
              {name : "Terasse HUE", type : "dim" , status : true, level : 10} ,
              {name : "Wohnen", type : "onoff", status : false, level : 0},
              {name : "Flur", type : "onoff" , status : true, level : 0},
              {name : "Treppe", type : "onoff", status : true, level : 0}];
let lightSelector = 0;

function lightSelectorFw() {
	if(lightSelector == lights.length-1) { lightSelector = 0 }
    else { lightSelector += 1; }
 }
 function lightSelectorBw() {
	if(lightSelector == 0) { lightSelector = lights.length-1} 
    else { lightSelector -= 1; }
 }
 
</script>

<Paper radius="md" withBorder override={MyXlCardShadow} >
    <Stack>
        <Group position='apart'>
            <Text weight={500} size='xl' position='right'>Licht</Text>
            <ActionIcon size={20} variant="light" ><HamburgerMenu size={20} /></ActionIcon>
        </Group>
        <Group position='center' direction="column">
            <LightBulb size=130 color={lights[lightSelector].status == true ? theme.colors['yellow500'].value : "white" }/>
            <Text size='sm'>On</Text>
        </Group>
        <Space h={5} />
        {#if lights[lightSelector].type == "onoff"}
            <Group spacing="md" position='center' style="height:60px">
                <Switch size="md" radius="lg" bind:checked={lights[lightSelector].status} />
            </Group>
        {:else}
            <Group spacing="md" position='center' style="height:60px">
                <Switch size="md" radius="lg" bind:checked={lights[lightSelector].status} />
                <Slider bind:value={lights[lightSelector].level} />
            </Group>
        {/if}
        <Space h={5} />
        <Group position="center" spacing="xl" >
            <ActionIcon variant="light" on:click={lightSelectorBw}>
                <CaretLeft size={20} />
            </ActionIcon>
            <div style="width:100px">
                <Text align='center'>{lights[lightSelector].name}</Text>
            </div>
            <ActionIcon  variant="light" on:click={lightSelectorFw}>
                <CaretRight size={20} />
            </ActionIcon>
        </Group>
    </Stack>
</Paper>
