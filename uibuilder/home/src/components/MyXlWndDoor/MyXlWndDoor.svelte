<script>
import app  from '../../main.js'
import { Stack, Paper, Group, Text, Space, ActionIcon, Loader} from '@svelteuidev/core';
import { theme } from '@svelteuidev/core';
import { CaretDown, CaretLeft, CaretRight, CaretUp, HamburgerMenu, Stop } from 'radix-icons-svelte';
import { MyXlCardShadow }  from '../../styles/default.js';
import BlindOpened from '../icons/BlindOpened.svelte';
import BlindClosed from '../icons/BlindClosed.svelte';
import BlindPartly from '../icons/BlindPartly.svelte';

// example {key: "00-All-Shutter", topic: "indb/homematic", name : "Alle", level : 100}
export let values = [];
let selectorIndex = 0;


function onClickCmd(direction) {
    let routing = values[selectorIndex].topic;
    let target =  values[selectorIndex].key;
 
    let cmd
    if(direction == "open") {
        cmd = "Open"
    } else if(direction == "close") {
        cmd = "Close"
    } else if(direction == "stop") {
        cmd = "Stop"
    }
    app.uibSend(routing, target, cmd, "MyXlWndDoor");
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
            <Text weight={500} size='xl' position='right'>Fenster / Türen</Text>
            <ActionIcon size={20} variant="light" ><HamburgerMenu size={20} /></ActionIcon>
        </Group>
        {#if values.length > 0}
            <Group position='center' direction="column">
                {#if values[selectorIndex].level >= 98}
                    <BlindOpened size=100 color={"white"}/>
                    <Text size='sm'>Offen</Text>
                {:else if values[selectorIndex].level <= 2}
                    <BlindClosed size=100 color={"white"}/>
                    <Text size='sm'>Geschlossen</Text>
                {:else}
                    <BlindPartly size=100 color={"white"}/>
                    <Text size='sm'>Teilw. Geschl.</Text>
                {/if}
            </Group>
            <Space h={10} />
            <Group position='center' direction="row" spacing="lg">
                <ActionIcon size={40} variant="light" on:click={() => onClickCmd("open")}><CaretUp size={30} /></ActionIcon>
                <ActionIcon size={40} variant="light" on:click={() => onClickCmd("stop")}><Stop size={30} /></ActionIcon>
                <ActionIcon size={40} variant="light"on:click={() => onClickCmd("close")}><CaretDown size={30} /></ActionIcon>
            </Group>
            <Space h={24} />
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
