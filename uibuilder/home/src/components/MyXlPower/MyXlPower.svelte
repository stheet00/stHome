<script>
import app  from '../../main.js'
import { Stack, Paper, Group, Text, Space, ActionIcon, Loader} from '@svelteuidev/core';
import { theme } from '@svelteuidev/core';
import Home from '../icons/Home.svelte';
import { CaretLeft, CaretRight, HamburgerMenu } from 'radix-icons-svelte';
import { MyXlCardShadow }  from '../../styles/default.js';
import PowerPole from '../icons/PowerPole.svelte';
import SolarRoof from '../icons/SolarRoof.svelte';
import Battery from '../icons/Battery.svelte';

// example {key: "00-Haus", topic: "indb/powerman", name : "Haus", power : 5}
export let values = [];
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
                    <Home size=100 color={"white"}/>
                    <Text size='sm'>Verbrauch</Text>
                {:else if values[selectorIndex].key == "Feed-In"}
                    <PowerPole size=100 color={"white"}/>
                    <Text size='sm'>{values[selectorIndex].direction}</Text>
                {:else if values[selectorIndex].key == "Pv"}
                    <SolarRoof size=100 color={"white"}/>
                    <Text size='sm'>Produktion</Text>
                {:else}
                    <Battery size=100 color={"white"}/>
                    <Text size='sm'>{values[selectorIndex].direction}</Text>
                {/if}
            </Group>

            <Group position='center' direction="column">
                <Text style='font-size:70px;'>{values[selectorIndex].power}</Text>
                <Text size='xl'>{values[selectorIndex].unit}</Text>
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
