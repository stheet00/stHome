<script>
    import { Stack, Paper, Group, Text, Space, ActionIcon} from '@svelteuidev/core';
    import { theme } from '@svelteuidev/core';
    import { CaretLeft, CaretRight, HamburgerMenu } from 'radix-icons-svelte';
    
    const MyXlCardShadow = {
            '$$gray': theme.colors['gray200'].value,
            boxShadow: '0 1px 2px $$gray',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                boxShadow: '0 1px 3px $$gray',
            }};
    
    let values = [{name : "Outdoor", temp : 24, humi : 40},
                { name : "Wohnen", temp : 10, humi : 40},
                { name : "Kind 1", temp : 24.4, humi : 40},
                { name : "Kind 2", temp : 25, humi : 40}
            ];
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
            <Group position='center' direction="column">
                <Group position='center' direction="row">
                    <Text style='font-size:100px;padding-left:25px;'>{values[selectorIndex].temp} </Text>
                    <Text size='xl'>°C</Text>
                </Group>
                <Group position='center' direction="row">
                    <Text style='font-size:50px;padding-left:25px;'>{values[selectorIndex].humi} </Text>
                    <Text size='xl'>%</Text>
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
                <div style="width:100px">
                    <Text align='center'>{values[selectorIndex].name}</Text>
                </div>
                <ActionIcon  variant="light" on:click={selectorFw}>
                    <CaretRight size={20} />
                </ActionIcon>
            </Group>
        </Stack>
    </Paper>
    