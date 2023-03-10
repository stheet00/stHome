<script>
import { Stack, Paper, Group, Button, Text, Badge, Switch, Space, ActionIcon} from '@svelteuidev/core';
import LightBulb from '../icons/LightBulb.svelte';
import { CaretLeft, CaretRight, HamburgerMenu } from 'radix-icons-svelte';

const MyXlCardShadow = {
        '$$blue': '#228be6',
        boxShadow: '0 1px 3px $$blue',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            boxShadow: '0 2px 5px $$blue',
        }};
</script>

<Paper radius="md" withBorder override={MyXlCardShadow}>
    <Stack  >
        <Group position='apart'>
            <Text weight={500} size='xl' position='right'>Licht</Text>
            <ActionIcon size={20} variant="light" ><HamburgerMenu size={20} /></ActionIcon>
        </Group>
        <Group position='center' direction="column">
            <LightBulb size=130 />
            <Text size='sm'>On</Text>
        </Group>
        <Space h={5} />
        <Group spacing="md" position='center' >
            <Switch size="md" radius="lg" />
        </Group>
        <Space h={5} />
        <Group position="center" spacing="xl">
            <ActionIcon variant="light" >
                <CaretLeft size={20} />
            </ActionIcon>
            <Text width=50 >Wohnen</Text>
            <ActionIcon  variant="light" >
                <CaretRight size={20} />
            </ActionIcon>
        </Group>
    </Stack>
</Paper>
