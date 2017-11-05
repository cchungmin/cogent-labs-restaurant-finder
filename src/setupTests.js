import 'whatwg-fetch';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Promise from 'promise-polyfill';
import sinon from 'sinon';

global.Promise = Promise;
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.sinon = sinon;

Enzyme.configure({ adapter: new Adapter() });
