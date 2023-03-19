<script>
import app  from '../../main.js'
import { Stack, Paper, Group, Text, Space, ActionIcon, Loader} from '@svelteuidev/core';
import { theme } from '@svelteuidev/core';
import Home from '../icons/Home.svelte';
import { CaretLeft, CaretRight, HamburgerMenu } from 'radix-icons-svelte';
import { MyXlCardShadow }  from '../../styles/default.js';
import PowerPole from '../icons/PowerPole.svelte';

// example {key: "00-Haus", topic: "indb/powerman", name : "Haus", power : 5}
export let values = [{key: "Home", topic: "indb/powerman", name : "Haus", power : 2.5},
                     {key: "Feed-In", topic: "indb/powerman", name : "Netz", power : -0.5},
                     {key: "Pv", topic: "indb/powerman", name : "Solar", power : 1.0},
                     {key: "Battery", topic: "indb/powerman", name : "Batterie", power : -0.5}                
];
let selectorIndex = 0;

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
            <Text weight={500} size='xl' position='right'>Powermeter</Text>
            <ActionIcon size={20} variant="light" ><HamburgerMenu size={20} /></ActionIcon>
        </Group>
        {#if values.length > 0}
            <Group position='center' direction="column">
                {#if values[selectorIndex].key == "Home"}
                    <Home size=130 color={"white"}/>
                {:else if values[selectorIndex].key == "Feed-In"}
                    <PowerPole size=130 color={"white"}/>
                {:else if values[selectorIndex].key == "Pv"}
                    <Home size=130 color={"white"}/>
                {:else}
                    <Home size=130 color={"white"}/>
                {/if}
                <Group position='center' direction="row">
                    <Text style='font-size:80px;padding-left:50px;'>{values[selectorIndex].power}</Text>
                    <Text style='padding-top:40px;' size='xl'>kWh</Text>
                </Group>
            </Group>
           
            <Group spacing="md" position='center' style="height:38px">
            </Group>

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
