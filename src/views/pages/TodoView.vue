<template>
    <div class="card">
        <DataTable :value="task_test" tableStyle="min-width: 50rem">
            <template #header>
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xl font-bold">Todo</span>
                    <Button icon="pi pi-refresh" rounded raised />
                </div>
            </template>
            <Column field="task" header="Task"></Column>
            <Column field="description" header="Description"></Column>

            <Column field="createdAt" header="Date de création">
                <template #body="slotProps">
                    <Button @click="visible = true">{{ slotProps.data.createdAt }} </Button>

                    <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }">
                        <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
                        <div class="flex items-center gap-4 mb-4">
                            <label for="username" class="font-semibold w-24">Username</label>
                            <InputText id="username" class="flex-auto" autocomplete="off" />
                        </div>
                        <div class="flex items-center gap-4 mb-8">
                            <label for="email" class="font-semibold w-24">Email</label>
                            <InputText id="email" class="flex-auto" autocomplete="off" />
                        </div>
                        <div class="flex justify-end gap-2">
                            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                            <Button type="button" label="Save" @click="visible = false"></Button>
                        </div>
                    </Dialog>
                </template>
            </Column>
            <template #footer> Reste {{ task_test ? task_test.length : 0 }} tâches à faire. </template>
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const task_test = [{ task: 'Task1', description: 'description task 1 lalalallaalal', createdAt: 'DATE' }];
const visible = ref(false);
</script>
