<template>
    <div class="card">
        <DataTable :value="tasks_todo" tableStyle="min-width: 50rem">
            <template #header>
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xl font-bold">Todo</span>
                    <Button icon="pi pi-plus" @click="visible_addTask = true" rounded raised />
                    <Dialog v-model:visible="visible_addTask" modal header="Ajouter une tâche" :style="{ width: '25rem' }">
                        <div class="flex items-center gap-4 mb-4">
                            <label for="task" class="font-semibold w-24">Tâches</label>
                            <InputText id="task" class="flex-auto" autocomplete="off" v-model="taskToAdd.task" />
                        </div>
                        <div class="flex items-center gap-4 mb-8">
                            <label for="description" class="font-semibold w-24">Description</label>
                            <InputText id="description" class="flex-auto" autocomplete="off" v-model="taskToAdd.description" />
                        </div>
                        <div class="flex items-center gap-4 mb-8">
                            <label class="font-semibold w-24">Dct</label>
                            <Select v-model="taskToAdd.dct" :options="dctSelected" optionLabel="name" class="w-56" placeholder="Select a Dct" />
                        </div>
                        <div class="flex justify-end gap-2">
                            <Button type="button" label="Cancel" severity="secondary" @click="visible_addTask = false"></Button>
                            <Button type="button" label="Save" @click="addTask"></Button>
                        </div>
                    </Dialog>
                </div>
            </template>
            <Column field="task" header="Task"></Column>
            <Column field="description" header="Description"></Column>
            <Column field="dct" header="Dct"></Column>
            <Column field="finish" header="Fait" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                <template #body="{ data }">
                    <a href="#" @click="change_task_state(data.id, tasks_todo)">
                        <i class="pi" :class="{ 'pi-check-circle text-green-500 ': data.finish, 'pi-times-circle text-red-500': !data.finish }"></i>
                    </a>
                </template>
            </Column>
            <Column field="created_at" header="Date de création">
                <template #body="{ data }">
                    {{ formatDate(data.created_at) }}
                </template>
            </Column>
            <Column field="finished_at" header="Fini le"></Column>
            <Column header="Edit">
                <template #body="{ data }">
                    <a href="#" class="mr-3" @click="majTask(data)">
                        <i class="pi pi-pencil"></i>
                    </a>
                    <a href="#">
                        <i class="pi pi-trash" @click="deleteTask(data.id)"></i>
                    </a>
                </template>
            </Column>
            <Dialog v-model:visible="visible_majTask" modal header="Modifier une tâche" :style="{ width: '25rem' }">
                <div class="flex items-center gap-4 mb-4">
                    <label for="task" class="font-semibold w-24">Tâches</label>
                    <InputText id="task" class="flex-auto" autocomplete="off" v-model="taskToMaj.task" />
                </div>
                <div class="flex items-center gap-4 mb-8">
                    <label for="description" class="font-semibold w-24">Description</label>
                    <InputText id="description" class="flex-auto" autocomplete="off" v-model="taskToMaj.description" />
                </div>
                <div class="flex items-center gap-4 mb-8">
                    <label class="font-semibold w-24">Dct</label>
                    <Select v-model="taskToMaj.dct" :options="dctSelected" optionLabel="name" class="w-56" placeholder="Select a Dct" />
                </div>
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible_majTask = false"></Button>
                    <Button type="button" label="Save" @click="saveMajTask"></Button>
                </div>
            </Dialog>

            <template #footer> Reste {{ tasks_todo ? tasks_todo.length : 0 }} tâches à faire. </template>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { formatDate } from '@/utils/utils';

const majTask = (data) => {
    visible_majTask.value = true;
    taskToMaj.value = { ...data };
    taskToMaj.value.dct = { name: taskToMaj.value.dct };
    console.log(taskToMaj.value.id);
};

const dctSelected = ref([{ name: 'Belz' }, { name: 'Carnac' }, { name: 'Crach' }, { name: 'Quiberon' }, { name: 'Pluvigner' }, { name: 'Saint-Anne' }, { name: '' }]);
const tasks_todo = ref(null);
const visible_addTask = ref(false);
const visible_majTask = ref(false);
const taskToAdd = ref({ dct: '', description: '', dct: '' });
const taskToMaj = ref({ dct: '', description: '', dct: '', id: null });

const testfunction = () => console.log('TEST');

async function addTask() {
    try {
        const res = await fetch('http://127.0.0.1:8000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task: taskToAdd.value.task,
                description: taskToAdd.value.description,
                dct: taskToAdd.value.dct.name
            })
        });
        if (!res.ok) throw new Error('Erreur réseau');
    } catch (err) {
        console.error('Erreur :', err);
    } finally {
        visible_addTask.value = false;
        loadData();
    }
}

async function saveMajTask() {
    try {
        const response = await fetch(`http://localhost:8000/tasks/${taskToMaj.value.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dct: taskToMaj.value.dct.name,
                description: taskToMaj.value.description,
                task: taskToMaj.value.task
            })
        });
        if (!response.ok) {
            throw new Error(`Erreur serveur : ${response.status}`);
        }
    } catch (err) {
        console.error('Erreur :', err);
    } finally {
        visible_majTask.value = false;
        loadData();
    }
}

async function deleteTask(id) {
    try {
        const res = await fetch(`http://localhost:8000/tasks/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('Erreur lors de la suppression');

        const result = await res.json();
        console.log('Supprimée :', result);
    } catch (err) {
        console.error(err);
    } finally {
        loadData();
    }
}
const change_task_state = (id, array) => {
    const item = array.find((obj) => obj.id === id);
    if (item) {
        item.finish = !item.finish;
        updateStateTask(id, item.finish);
    }
};
const updateStateTask = async (taskId, state) => {
    try {
        const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                finish: state
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur serveur : ${response.status}`);
        }

        const data = await response.json();
        console.log('Tâche mise à jour :', data);
    } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
    }
};
async function loadData() {
    try {
        const tasks = await Promise.all([fetch('http://127.0.0.1:8000/tasks')]);
        tasks_todo.value = await tasks[0].json();
    } catch (e) {
        console.error('Erreur lors du chargement des données', e);
    } finally {
    }
}
onMounted(loadData);
</script>
