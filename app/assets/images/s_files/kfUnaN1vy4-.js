/*!CK:133363782!*//*1427086798,*/

if (self.CavalryLogger) { CavalryLogger.start_js(["4mQ3B"]); }

__d("ChatTypingIndicator.react",["ChatAuthorPhotoBlock.react","ReactComponentWithPureRenderMixin","React","cx"],function(a,b,c,d,e,f,g,h,i,j){b.__markCompiled&&b.__markCompiled();var k=i,l=k.PropTypes,m=i.createClass({displayName:"ChatTypingIndicator",mixins:[h],propTypes:{userID:l.string,showName:l.bool},render:function(){var n=this.props,o=n.userID,p=n.showName;return (i.createElement(g,{authorID:o,className:(("_gfq")+(p?' '+"_52fu":'')),hideName:!p},i.createElement("div",{className:"_52ft"},i.createElement("div",{className:"_gfp",ref:"bubble"}))));},getBubble:function(){return this.refs.bubble;}});e.exports=m;},null);
__d("ChatTypingIndicators.react",["ChatTypingIndicator.react","DOM","MercuryIDs","MercuryParticipants","React","SubscriptionsHandler","Tooltip","MercuryTypingReceiver","arraySort","createObjectFrom","cx","emptyFunction","fbt","joinClasses","MercuryThreadInformer"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t){b.__markCompiled&&b.__markCompiled();var u=b('MercuryThreadInformer').get(),v=k,w=v.PropTypes,x=k.createClass({displayName:"ChatTypingIndicators",propTypes:{indicatorClass:w.func,indicatorsWillShow:w.func,indicatorsDidShow:w.func,rootClassName:w.string,threadID:w.string.isRequired},getDefaultProps:function(){return {indicatorClass:g,indicatorsWillShow:r,indicatorsDidShow:r};},getInitialState:function(){return {typingUserIDs:[]};},componentDidMount:function(){this._subscriptions=new l();this._subscriptions.addSubscriptions(n.addRetroactiveListener('state-changed',this.typingStateChanged),u.subscribe('messages-received',this.messagesReceived));},componentWillReceiveProps:function(y){if(y.threadID!=this.props.threadID)this.setState({typingUserIDs:[]});},componentWillUpdate:function(y,z){if(z.typingUserIDs.length>0)this.props.indicatorsWillShow();},componentDidUpdate:function(){if(this.state.typingUserIDs.length>0)this.props.indicatorsDidShow();j.getMulti(this.state.typingUserIDs,function(y){if(this.isMounted())this.state.typingUserIDs.forEach(function(z){var aa=y[z],ba=this.refs[z].getBubble();if(ba)m.set(k.findDOMNode(ba),this.renderTooltip(aa.short_name),'above','left');}.bind(this));}.bind(this));},componentWillUnmount:function(){this._subscriptions.release();},render:function(){var y=i.isMultichat(this.props.threadID);return (k.createElement("div",{className:t(this.props.rootClassName,"_2fsr")},this.state.typingUserIDs.map(function(z){return this._renderTypingIndicator(z,!!y);}.bind(this))));},_renderTypingIndicator:function(y,z){var aa=this.props.indicatorClass;return (k.createElement(aa,{key:y,ref:y,showName:z,userID:y}));},renderTooltip:function(y){var z=h.create('span');k.render(k.createElement("span",null,s._("{name} is typing...",[s.param("name",y)])),z);return z;},typingStateChanged:function(y){if(this.props.threadID in y)this.setState({typingUserIDs:o(y[this.props.threadID])});},messagesReceived:function(y,z){if(this.props.threadID in z){var aa=z[this.props.threadID],ba=p(aa.map(function(ca){return ca.author;}));this.setState({typingUserIDs:o(this.state.typingUserIDs.filter(function(ca){return !ba[ca];}))});}}});e.exports=x;},null);
__d("MercurySpoofWarning.react",["MercuryParticipants","React","fbt"],function(a,b,c,d,e,f,g,h,i){b.__markCompiled&&b.__markCompiled();var j=h,k=j.PropTypes,l=h.createClass({displayName:"MercurySpoofWarning",propTypes:{authorID:k.string.isRequired},getInitialState:function(){return {author:{name:''}};},componentWillMount:function(){this.componentWillReceiveProps(this.props);},componentWillReceiveProps:function(m){g.get(m.authorID,function(n){return this.setState({author:n});}.bind(this));},render:function(){return (h.createElement("div",h.__spread({},this.props),i._("Unable to confirm {name_or_email} as the sender.",[i.param("name_or_email",this.state.author.name)])));}});e.exports=l;},null);
__d("MercuryTypingAnimation.react",["React","cx","joinClasses"],function(a,b,c,d,e,f,g,h,i){b.__markCompiled&&b.__markCompiled();'use strict';var j=g,k=j.PropTypes,l=g.createClass({displayName:"MercuryTypingAnimation",propTypes:{color:k.oneOf(['light','dark'])},getDefaultProps:function(){return {color:'dark'};},render:function(){var m=(("_4a0v")+(this.props.color==='light'?' '+"_4a0w":'')+(this.props.color==='dark'?' '+"_4a0x":''));return (g.createElement("div",{className:i(this.props.className,m)},g.createElement("div",{className:"_4b0g"},g.createElement("div",{className:"_4a0y"}),g.createElement("div",{className:"_4a0y"}),g.createElement("div",{className:"_4a0y"}))));}});e.exports=l;},null);
__d("MercuryTypingIndicator",["Animation","Bootloader","BootloadedComponent.react","ChatConfig","CSS","DOM","MercuryTypingReceiver","MercuryViewer","MercuryParticipants","React","Style","ChatTabTemplates","Tooltip","copyProperties","csx","cx","fbt","MercuryThreadInformer"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w){b.__markCompiled&&b.__markCompiled();var x=b('MercuryThreadInformer').get(),y=[];x.subscribe('messages-received',function(ba,ca){y.forEach(function(da){var ea=ca[da._threadID];ea&&da.receivedMessages(ea);});});m.addRetroactiveListener('state-changed',function(ba){y.forEach(function(ca){var da=ba[ca._threadID];da&&ca._handleStateChanged(da);});});function z(ba){var ca=r[':fb:chat:conversation:message-group'].build(),da=r[':fb:mercury:typing-indicator:typing'].build();k.addClass(ca.getRoot(),"_50kd");var ea=ca.getNode('profileLink');s.set(ea,ba.name,'left');ea.href=ba.href;ca.setNodeContent('profileName',ba.name);ca.setNodeProperty('profilePhoto','src',ba.image_src);var fa=w._("{name} is typing...",[w.param("name",ba.short_name)]);s.set(da.getRoot(),fa,'above');l.appendContent(ca.getNode('messages'),da.getRoot());return ca;}function aa(ba,ca,da){this._animations={};this._activeUsers={};this._typingIndicator=ca;this._messagesView=da;this._threadID=ba;this._subscription=m.addRetroactiveListener('state-changed',function(ea){var fa=ea[this._threadID];fa&&this._handleStateChanged(fa);}.bind(this));y.push(this);}t(aa.prototype,{destroy:function(){Object.keys(this._activeUsers).forEach(this._removeUserBubble.bind(this));this._controller.destroy();y.remove(this);},receivedMessages:function(ba){ba.forEach(function(ca){if(!n.isViewer(ca.author))this._removeUserBubble(ca.author);}.bind(this));},_handleStateChanged:function(ba){for(var ca in this._activeUsers)if(ba.indexOf(ca)===-1){this._slideOutUserBubble(ca);delete this._activeUsers[ca];}if(ba.length)o.getMulti(ba,function(da){var ea=this._messagesView.isScrolledToBottom(),fa={};for(var ga in da){var ha=this._activeUsers[ga];fa[ga]=ha||z(da[ga]).getRoot();if(!ha){l.appendContent(this._typingIndicator,fa[ga]);if(j.get('chat_thread_typing_indicator_animated')){var ia=l.scry(this._typingIndicator,"._510u");for(var ja=0,ka=ia.length;ja<ka;ja++)p.render(p.createElement(i,{bootloadPlaceholder:p.createElement("span",null),bootloadComponent:function(ma){h.loadModules(["MercuryTypingAnimation.react"],ma);},className:"_3e2s"}),ia[ja]);}}}var la=Object.keys(fa).length>0;ea&&this._messagesView.scrollToBottom(la);this._activeUsers=fa;}.bind(this));},_removeUserBubble:function(ba,ca){var da=this._getCurrentAnimation(ba,ca);if(da){da.animation.stop();l.remove(da.elem);delete this._animations[ba];}if(ba in this._activeUsers){l.remove(this._activeUsers[ba]);delete this._activeUsers[ba];}if(ca&&j.get('chat_thread_typing_indicator_animated')){var ea=l.scry(ca,"._510u");for(var fa=0,ga=ea.length;fa<ga;fa++)p.unmountComponentAtNode(ea[fa]);}ca&&l.remove(ca);},_slideOutUserBubble:function(ba){var ca=this._activeUsers[ba];if(this._getCurrentAnimation(ba,ca)){return;}else if(ca){q.set(ca,'overflow','hidden');var da=(new g(ca)).from('opacity',1).from('height',ca.offsetHeight).to('height',0).to('opacity',0).ease(g.ease.end).duration(250).ondone(this._removeUserBubble.bind(this,ba,ca)).go();this._animations[ba]={animation:da,elem:ca};}},_getCurrentAnimation:function(ba,ca){if(this._animations[ba]&&(!ca||this._animations[ba].elem===ca))return this._animations[ba];}});e.exports=aa;},null);