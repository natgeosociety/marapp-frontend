import loadable from '@loadable/component';

const AsyncPage = loadable((props: any) => import(`pages/${props.page}`));
export default AsyncPage;
