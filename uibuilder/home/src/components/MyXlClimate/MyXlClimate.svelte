<script>
    import { Stack, Paper, Group, Text, Space, ActionIcon, Loader} from '@svelteuidev/core';
    import { CaretLeft, CaretRight, HamburgerMenu } from 'radix-icons-svelte';
    import { MyXlCardShadow }  from '../../styles/default.js';
    
    // example {name : "Wohnen", temp : 24.3, humi : 40}
    export let values = [];
    let selectorIndex = 0;
    
    function selectorFw() {
        if(selectorIndex == values.length-1) { selectorIndex = 0 }
        else { selectorIndex += 1; }
     }
     function selectorBw() {
        if(selectorIndex == 0) { selectorIndex = values.length-1} 
        else { selectorIndex -= 1; }
     }
     
    </script>
    
    <Paper radius="md" withBorder override={MyXlCardShadow} >
        <Stack>
            <Group position='apart'>
                <Text weight={500} size='xl' position='right'>Temperatur</Text>
                <ActionIcon size={20} variant="light" ><HamburgerMenu size={20} /></ActionIcon>
            </Group>
            {#if values.length > 0}
                <Group position='center' direction="column">
                    <Group position='center' direction="row">
                        <Text style='font-size:100px;padding-left:25px;'>{values[selectorIndex].temp} </Text>
                        <Text size='xl' style='padding-top:70px;'>°C</Text>
                    </Group>
                    <Group position='center' direction="row">
                        <Text style='font-size:50px;padding-left:25px;'>{values[selectorIndex].humi} </Text>
                        <Text size='xl' style='padding-top:24px;'>%</Text>
                    </Group>
                </Group>
                <Space h={5} />
                <Group style="height:55px;"> 
                </Group>
                <Space h={5} />
                <Group position="center" spacing="xl" >
                    <ActionIcon variant="light" on:click={selectorBw}>
                        <CaretLeft size={20} />
                    </ActionIcon>
                    <div style="width:140px">
                        <Text size='lg' align='center'>{values[selectorIndex].name}</Text>
                    </div>
                    <ActionIcon  variant="light" on:click={selectorFw}>
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
    