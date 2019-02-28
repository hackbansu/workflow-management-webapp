import _ from 'lodash';

import ApiConstants from 'constants/api';
import TaskConstants from 'constants/task';
import { isAbsoluteUrl, regexConst } from 'constants/index.js';
import moment from 'moment';

export function apiTaskFormCouple(task) {
    // couple api task format for taskform variable format

    // assignee: 2
    // completedAt: "2019-02-23T08:52:27Z"
    // description: "kajsndkjn"
    // duration: "00:00:00"
    // id: 1
    // parentTask: null
    // startDelta: "00:00:00"
    // status: 2
    // title: "Task 1"
    // workflow: 1
    const { title: taskTitle, description: taskDetail, parent_task: parentTask, completed_at: completedAt } = task;
    let { duration, start_delta: startDelta } = task;
    startDelta = startDelta.match(regexConst.splitDateTime).groups;
    const taskStartDeltaDays = startDelta.days;
    const taskStartDeltaTime = startDelta.time;

    duration = duration.match(regexConst.splitDateTime).groups;
    const taskDurationDays = duration.days;
    const taskDurationTime = duration.time;
    ['title', 'description', 'duration', 'start_delta', 'parent_task', 'completed_at'].map(prop => delete task[prop]);

    return {
        ...task,
        completedAt,
        parentTask,
        taskDetail,
        taskTitle,
        taskStartDeltaDays,
        taskDurationDays,
        taskDurationTime,
        taskStartDeltaTime,
    };
}

export function taskFormApiCouple(task) {
    // couple task form data to api format
    return {
        title: task.taskTitle,
        start_delta: `${task.taskStartDeltaDays}:${task.taskStartDeltaTime}`,
        duration: `${task.taskDurationDays}:${task.taskDurationTime}`,
        description: task.taskDetail,
        assignee: task.assignee,
        parent_task: task.parentTask,
    };
}

export function parseEmployeeData(emp) {
    const { first_name: firstName, last_name: lastName, email, profile_photo_url: profilePhoto, id: userId } = emp.user;
    const { designation, is_admin: isAdmin, status, id: employeeId, join_at: joinAt, left_at: leftAt } = emp;

    const data = {
        user: {
            firstName,
            lastName,
            profilePhoto: isAbsoluteUrl(profilePhoto) ? profilePhoto : `${ApiConstants.MEDIA_URL}${profilePhoto}`,
            email: email || '',
            id: userId,
        },
        designation,
        isAdmin,
        status,
        id: employeeId,
        joinAt,
        leftAt,
    };
    data.joinAt = data.joinAt ? moment(data.joinAt).format('YYYY-MM-DD HH:mm') : '';
    data.leftAt = data.leftAt ? moment(data.leftAt).format('YYYY-MM-DD HH:mm') : '';
    return data;
}

export function getRandomBorder() {
    const items = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'];
    return `border-${_.sample(items)}`;
}

export function formatTasks(tasks) {
    tasks = tasks || [];
    const upcomming = tasks.filter(task => task.status === TaskConstants.STATUS.UPCOMMING);
    const ongoing = tasks.filter(task => task.status === TaskConstants.STATUS.ONGOING);
    const complete = tasks.filter(task => task.status === TaskConstants.STATUS.COMPLETE);
    return {
        upcomming: _.keyBy(upcomming, 'id'),
        ongoing: _.keyBy(ongoing, 'id'),
        complete: _.keyBy(complete, 'id'),
    };
}

function formatWorkflow(workflow) {
    const { start_at: startAt, complete_at: completeAt } = workflow;
    let { tasks } = workflow;
    tasks = tasks.map(task => {
        task = apiTaskFormCouple(task);
        return task;
    });
    tasks = _.keyBy(tasks, 'id');
    delete workflow.start_at;
    delete workflow.complete_at;
    delete workflow.tasks;
    return { startAt, completeAt, tasks, ...workflow };
}

export function formatPermission(permission) {
    if (permission instanceof Array) {
        permission = permission.map(perm => ({
            id: String(perm.id),
            employee: String(perm.employee),
            permission: String(perm.permission),
        }));
        return _.keyBy(permission, 'id');
    }
    return {
        id: String(permission.id),
        employee: String(permission.employee),
        permission: String(permission.permission),
    };
}

export function parseWorkflow(workflows) {
    if (workflows instanceof Array) {
        return workflows.map(workflow => formatWorkflow(workflow));
    }
    return formatWorkflow(workflows);
}

export function parseDateTime(dateTime) {
    return moment(dateTime).format('YYYY:MM:DD HH:MM');
}

export function parseTimeDelta(deltaTime) {
    if (!deltaTime) {
        return '';
    }

    const arr = deltaTime.split(' ');
    let days = 0;
    const hourMinuteSeconds = arr.slice(-1)[0].split('.')[0];
    if (arr.length === 2) {
        days = arr[0];
    }

    return `${days} day(s) - ${hourMinuteSeconds}`;
}
