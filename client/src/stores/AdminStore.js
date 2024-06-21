import { defineStore } from 'pinia'
import { ref } from 'vue'

// export const AdminStore = defineStore("admin", {
//     state: () => {
//         return {
//             id: 0,
//             account: "",
//             token: ""
//         }
//     },
//     actions: [],
// })

export const AdminStore = defineStore("admin", () => {
    const id = ref(0)
    const account = ref("")
    const token = ref("")
    const num = ref(1)
    
    function addNum(){
        num.value++
    }
    return { id, account, token,num ,addNum}
})