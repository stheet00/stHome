<script>
    import { Grid, Switch, Group, Paper, Title, Modal, Space, Loader, Text, SimpleGrid, UnstyledButton} from '@svelteuidev/core';
    import { getMyGlobalParamData } from '../../data/MyGlobalParam.js';
    import app  from '../../main.js'

    // key | name | value | dscLong 
    let values = [];
    let modalOpened = false;
    let modalData = null;

    function openModal(index) {
        modalData = values[index]; 
        modalOpened = true;
    }

    function onSwitch(index) {
        uibSend("switch");
    }

    function uibSend(trigger) {
        let routing = values[selectorIndex].topic;
        let target =  values[selectorIndex].key;
    
        app.uibSend(routing, target, cmd, "MyXlLight");
    }

    function onReload() {
            const vals = getMyGlobalParamData(app.getInDbData());
            values = vals;
    };

    export let reload = false;
    $: reload && onReload();
    
</script>
<Modal opened={modalOpened} on:close={() => modalOpened = false}>
    <Text size='xl' weight={'bold'} position='left'>some text</Text> 
</Modal> 

    <Title order={4}>Settings</Title>
    <Space h="xl" />
    {#if values.length > 0}
    <SimpleGrid  cols={3}>
        {#each values as v, i}        
        <Paper radius="md" withBorder>
            <UnstyledButton on:click={() => openModal(i)}>
                <Grid align="center" >
                    <Grid.Col span={8}>
                        <Group position="left">
                            <Text size='xl' weight={'bold'} position='left'>{v.name}</Text> 
                            <Text size='md' position='right'>{v.dscLong}</Text>
                            <Text size='md' position='right'>{i}</Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        {#if v.uiType == "switch"}
                        <Switch size="lg" onLabel="ON" offLabel="OFF" checked={v.value} on:click={onSwitch} />
                        {:else if v.uiType == "radio"}
                        <Text size={30} position='right'>{v.value}{v.unit} </Text>
                        {:else if v.uiType == "drop"}
                        <Text size={30} position='right'>{v.value}{v.unit}</Text>
                        {/if}
                    </Grid.Col>
                </Grid>
            </UnstyledButton>
        </Paper>
        {/each}
    </SimpleGrid>
    {:else}
        <Space h={100} />
        <Group position="center" >
            <Loader variant='dots' color='gray' size='xl'/>
        </Group>
    {/if}


    
   
 
    


