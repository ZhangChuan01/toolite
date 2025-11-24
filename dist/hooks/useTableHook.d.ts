export default function useTableHook<T extends abstract new (...args: any) => any>(formDataList?: any): {
    mytable: globalThis.Ref<InstanceType<T> | undefined, InstanceType<T> | undefined>;
    dialogVisible: globalThis.Ref<boolean, boolean>;
    operate: globalThis.Ref<string, string>;
    rowValue: globalThis.Ref<any, any>;
    create: () => void;
    edit: (row: any, diydata?: any) => void;
    resetForm: () => void;
    deleteData: (fun: any, data: any, callback?: any, funArgs?: any[]) => void;
};
