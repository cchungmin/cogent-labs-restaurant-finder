import 'whatwg-fetch';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Promise from 'promise-polyfill';

global.Promise = Promise;
global.shallow = shallow;
global.render = render;
global.mount = mount;

Enzyme.configure({ adapter: new Adapter() });
