const modal = document.querySelector(".modal") ;
const modalForm = document.querySelector('div.task-form') ;
const btnModalCategory = document.querySelector('div.modal-menu') ;
const modalCategory = document.querySelector('div.category-modal') ;
const btnShow = document.querySelector(".btn-show") ;
const iconShow = document.querySelector(".btn-show i") ;
const btnAdd = document.querySelector('button.btn-add') ;
const subject = document.querySelector('input.subject') ;
const description = document.querySelector('input.description') ;
const listBody = document.querySelector('div.todo-list-body ul.list') ;
const allTasks = document.querySelector('li.all') ;
const all = allTasks.children[0] ;
const completedTasks = document.querySelector('li.completed') ;
const completed = completedTasks.children[0] ;
const uncompletedTasks = document.querySelector('li.uncompleted') ;
const uncompleted = uncompletedTasks.children[0] ;
const categoryList = document.querySelectorAll('div.category-modal ul li ') ;

const date = new Date() ;
const year = date.getFullYear() ;
const month = date.getMonth() + 1 ;
const day = date.getDate() ;
const myDate = gregorian_to_jalali(year , month , day); // return Array of Date

const show = ()=>{
    modal.style.display = "block" ;
    modal.classList.remove('hide') ;
    modal.classList.add('show') ;
    btnShow.setAttribute('title' , 'حذف') ;
    iconShow.className = 'fa fa-times fa-lg' ;
    iconShow.style.color = "red" ;
}
const hide = ()=>{
    modal.classList.remove('show') ;
    modal.classList.add('hide') ;
    setTimeout(function(){
        modal.style.display = "none" ;
    } , 500) 
    btnShow.setAttribute('title' , 'افزودن') ;
    iconShow.className = 'fal fa-pencil-alt fa-lg' ;
    iconShow.style.color = '#165316' ;
    subject.value = "" ;
    description.value = "" ;
    const btnEdit = document.querySelector('button.btn-edit') ;
    if(btnEdit){
        btnEdit.remove() ;
        const btnAdd = document.createElement('button')
        const iconAdd = '<i class="fas fa-plus-circle"></i>' ;
        btnAdd.innerHTML = iconAdd ;
        btnAdd.className = "btn btn-add" ;
        btnAdd.title = "افزودن" ;
        modalForm.appendChild(btnAdd) ;
    }
}
const add = ()=>{
    const emptyList = document.querySelector('li.list-empty') ;
    if(emptyList){
        emptyList.remove() ;
    }
    const listItem = document.createElement('li') ;
    listItem.classList.add('list-item') ;
    listItem.innerHTML = `  <div class="subject">
                                <div class="title">${subject.value}</div>
                                <div class="date">${myDate[2]}`+`/`+`${myDate[1]}`+`/`+`${myDate[0]}</div>
                                <div class="state uncomplete"></div>
                                <div class="operator">
                                    <i class="far fa-file-edit edit" title="ویرایش" ></i>
                                    <i class="far fa-trash-alt delete" title="حذف" ></i>
                                </div>
                            </div>
                            <div class="description">${description.value}</div>` ;
    listBody.appendChild(listItem) ;
    const date = document.querySelector('div.date') ;
    const todo = { subject : subject.value , description : description.value , date : date.innerHTML , state : 0 } ;
    addToLocal(todo) ;
    filtredUncompleted() ;
    uncompletedTasks.children[1].innerHTML = filtredUncompleted().length ;
    hide() ;
}
const editTask = (data)=>{
    show() ;
    const sub = data.closest('li.list-item').children[0].children[0] ;
    const des = data.closest('div.subject').nextElementSibling ;

    subject.value = sub.textContent ;
    description.value = des.textContent ;

    const btnAdd = document.querySelector('.btn-add') ;
    if(btnAdd){
        btnAdd.remove() ;
    }
    const btnEdit = document.querySelector('button.btn-edit') ;
    if(!btnEdit){
        const btnEdit = document.createElement('button')
        const iconEdit = '<i class="fas fa-plus-circle"></i>' ;
        btnEdit.innerHTML = iconEdit ;
        btnEdit.className = "btn btn-edit" ;
        btnEdit.title = "ویرایش" ;
        modalForm.appendChild(btnEdit) ;

        btnEdit.addEventListener('click' , () => {
            editSubjectLocal(sub) ;
            sub.textContent = subject.value ;
            des.textContent = description.value ;
            hide() ;
        })
    }
}
const addToLocal = (todo)=>{
    let savedItem = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [] ;
    savedItem.push(todo) ;
    localStorage.setItem('todos' , JSON.stringify(savedItem)) ;
} 
const deleteLocal = (target)=>{
    let savedItem = JSON.parse(localStorage.getItem("todos")) ;
    const filteredItem = savedItem.filter((todo)=>{
        return todo.subject != target ;
    })
    localStorage.setItem( 'todos' , JSON.stringify(filteredItem)) ;
}
const editStateLocal = (target)=>{
    let savedItem = JSON.parse(localStorage.getItem("todos")) ;
    savedItem.forEach((item)=>{
        if(item.subject == target.previousElementSibling.previousElementSibling.textContent){
            item.state = 1 ;
        } ;
    })
    localStorage.setItem('todos' , JSON.stringify(savedItem)) ;
}
const editSubjectLocal = (sub)=>{
    let savedItem = JSON.parse(localStorage.getItem("todos")) ;
    savedItem.forEach((item)=>{
        if(item.subject == sub.textContent ){
            item.subject = subject.value ;
            item.description = description.value ;
        } ;
    })
    localStorage.setItem('todos' , JSON.stringify(savedItem)) ;
}
const getLocal = ()=>{
    const mytodo = JSON.parse(localStorage.getItem("todos"))  ;
    mytodo.forEach((todo)=>{
        let state , _class  ;
        if(todo.state != 0 ) {
            _class = "completed"
        }else{
            _class = 'uncomplete'
        }
        const listItem = document.createElement('li') ;
        listItem.classList.add('list-item') ;
        listItem.innerHTML = `  <div class="subject">
                                    <div class="title">${todo.subject}</div>
                                    <div class="date">${todo.date}</div>
                                    <div class="state ${_class} "></div>
                                    <div class="operator">
                                        <i class="far fa-file-edit edit" title="ویرایش" ></i>
                                        <i class="far fa-trash-alt delete" title="حذف" ></i>
                                    </div>
                                </div>
                                <div class="description">${todo.description}</div>` ;
        listBody.appendChild(listItem) ;
    }) ;
}
const emptyList = ()=>{
    const listItem = document.querySelectorAll('li.list-item') ;
    if(listItem.length == 0){
        const li = document.createElement('li') ;
        li.classList.add('list-empty') ;
        li.innerHTML = "در حال حاضر وظیفه ای وجود ندارد!!!" ;
        listBody.appendChild(li) ;
    }
}
const allTask = ()=>{
    const mytodo = JSON.parse(localStorage.getItem("todos"))  ;
    allTasks.children[1].innerHTML = mytodo.length ;
}
const filtredCompleted = ()=>{
    const mytodo = JSON.parse(localStorage.getItem("todos"))  ;
    const filtredCompleted = mytodo.filter((todo)=>{
        return todo.state !=0 ;
    })
    return filtredCompleted ;
}
const filtredUncompleted = ()=>{
    const mytodo = JSON.parse(localStorage.getItem("todos"))  ;
    const filtredUncompleted = mytodo.filter((todo)=>{
        return todo.state == 0 ;
    })
    return filtredUncompleted ;
} 
const showUncompleted = ( item )=>{
    listBody.innerHTML = "" ;
    item.forEach((todo)=>{
        const listItem = document.createElement('li') ;
        listItem.classList.add('list-item') ;
        listItem.innerHTML = `  <div class="subject">
                                    <div class="title">${todo.subject}</div>
                                    <div class="date">${todo.date}</div>
                                    <div class="state uncomplete "></div>
                                    <div class="operator">
                                        <i class="far fa-file-edit edit" title="ویرایش" ></i>
                                        <i class="far fa-trash-alt delete" title="حذف" ></i>
                                    </div>
                                </div>
                                <div class="description">${todo.subject}</div>` ;
        listBody.appendChild(listItem) ;
    })
}
const addActiveClass = (target)=>{
    target.parentElement.classList.add('active') ;
    const siblings = target.parentElement.parentElement.childNodes ;
    const targetClass = target.parentElement.className ;
    siblings.forEach((item)=>{
        if(item.className != targetClass ){
            if(item.classList){
                item.classList.remove('active') ;
            }
        }
    });
}

btnShow.addEventListener("click" , ()=>{
    if (modal.className.includes('show'))  hide() ; 
    else show() ;
}) ;
document.addEventListener('click' , (e)=>{
    const btnAdd = document.querySelector('button.btn-add') ;
    if(e.target == btnAdd || e.target.parentElement == btnAdd) {
        if(subject.value !== "" && description.value !== '') { 
            add() ;
            allTask() ; 
        }
    }
    if(e.target.classList.contains('state')) {
        const unCompleted = document.querySelector('li.uncompleted') ;
        const target = e.target ;
        editStateLocal(target) ;
        //target.innerHTML = "انجام شده" ;
        target.classList.remove('uncomplete') ;
        target.classList.add('completed') ;
        completedTasks.children[1].innerHTML = filtredCompleted().length ;
        uncompletedTasks.children[1].innerHTML = filtredUncompleted().length ;
        if(unCompleted.classList.contains('active')) {
            const item = filtredUncompleted() ;
            console.log(item) ;
            showUncompleted(item) ;
        }
        emptyList() ; 
    }
})
listBody.addEventListener('click' , (e)=>{
    if(e.target.classList.contains('delete')){
        const target = e.target.parentElement.parentElement.childNodes[1].innerHTML ;
        e.target.closest('li.list-item').remove() ;
        deleteLocal(target) ;
        allTask() ;
        emptyList() ;
        filtredCompleted() ;
        completedTasks.children[1].innerHTML = filtredCompleted().length ;
    } 
    if(e.target.classList.contains('edit')) {
        const data = e.target ;
        editTask(data) ;
    }
})
btnModalCategory.addEventListener('click' , ()=>{ 
    if(modalCategory.classList.contains('visible')) {
        btnModalCategory.firstElementChild.className = "far fa-bars" ;
        modalCategory.classList.add('unvisible') ; 
        modalCategory.classList.remove('visible') ; 
        setTimeout(function(){
            modalCategory.style.display = "none"
        } , 500)
    }else {
        modalCategory.style.display = "block" ;
        modalCategory.classList.remove('unvisible') ;
        modalCategory.classList.add('visible') ;
        btnModalCategory.firstElementChild.className = "far fa-times" ;
        const todoBodyHeight = document.querySelector('.todo-list-body').clientHeight ;
        modalCategory.style.height = todoBodyHeight + "px" ;
    }
})
all.addEventListener('click' , (e)=>{
    const target = e.target ;
    listBody.innerHTML = "" ;
    addActiveClass(target) ;
    getLocal() ;
})
completed.addEventListener('click' , (e)=>{
    const target = e.target ;
    listBody.innerHTML = "" ;
    filtredCompleted().forEach((todo)=>{
        const listItem = document.createElement('li') ;
        listItem.classList.add('list-item') ;
        listItem.innerHTML = `  <div class="subject">
                                    <div class="title">${todo.subject}</div>
                                    <div class="date">${todo.date}</div>
                                    <div class="state completed "></div>
                                    <div class="operator">
                                        <i class="far fa-file-edit edit" title="ویرایش" ></i>
                                        <i class="far fa-trash-alt delete" title="حذف" ></i>
                                    </div>
                                </div>
                                <div class="description">${todo.description}</div>` ;
        listBody.appendChild(listItem) ;
    })
    addActiveClass(target) ;
    emptyList() ;
})
uncompleted.addEventListener('click' , (e)=>{
    const target = e.target ;
    const item = filtredUncompleted() ;
    showUncompleted(item) ;
    addActiveClass(target) ;
    emptyList() ;
})
document.addEventListener('DOMContentLoaded' , ()=>{
    getLocal() ;
    emptyList() ;
    allTask() ;
    completedTasks.children[1].innerHTML = filtredCompleted().length ;
    uncompletedTasks.children[1].innerHTML = filtredUncompleted().length ; 
})

