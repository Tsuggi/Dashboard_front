<template>
    <div class="card">
        <DataTable :value="tasks_todo" tableStyle="min-width: 50rem">
            <template #header>
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xl font-bold">Todo</span>
                    <Button icon="pi pi-plus" @click='addTask' rounded raised />
                </div>
            </template>
            <Column field="task" header="Task"></Column>
            <Column field="description" header="Description"></Column>
            <Column field="dct" header="Dct"></Column>

            <Column field="finish" header="Fait" dataType="boolean" bodyClass="text-center" style="min-width: 8rem" cursor-pointer>
                <template #body="{ data }">
                    <i @click="change_task_state(data.id, tasks_todo)" class="pi" :class="{ 'pi-check-circle text-green-500 ': data.finish, 'pi-times-circle text-red-500': !data.finish }"></i>
                </template>
            </Column>

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
            <template #footer> Reste {{ tasks_todo ? tasks_todo.length : 0 }} tâches à faire. </template>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const tasks_todo = ref(null);
const visible = ref(false);

const addTask = ()=>{

}

const change_task_state = (id, array) => {
    const item = array.find((obj) => obj.id === id);
    if (item) item.finish = !item.finish;
};

onMounted(async () => {
    try {
        const tasks = await Promise.all([fetch('http://127.0.0.1:8000/tasks')]);
        tasks_todo.value = await tasks[0].json();
    } catch (e) {
        console.error('Erreur lors du chargement des données', e);
    } finally {
    }
});
</script>
