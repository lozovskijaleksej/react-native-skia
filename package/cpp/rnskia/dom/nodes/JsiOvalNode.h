#pragma once

#include "JsiDomDrawingNode.h"
#include "RectProp.h"

namespace RNSkia {

class JsiOvalNode : public JsiDomDrawingNode, public JsiDomNodeCtor<JsiOvalNode> {
public:
  JsiOvalNode(std::shared_ptr<RNSkPlatformContext> context) :
  JsiDomDrawingNode(context, "skOval") {}
    
protected:
  void draw(DrawingContext* context) override {
    RNSkLogger::logToConsole(context->getDebugDescription());
    context->getCanvas()->drawOval(*_rectProp->getDerivedValue(), *context->getPaint());
  }
  
  void defineProperties(NodePropsContainer* container) override {
    JsiDomDrawingNode::defineProperties(container);
    _rectProp = container->defineProperty(std::make_shared<RectProps>(PropNameRect));
    _rectProp->require();
  }
  
private:
  RectProps* _rectProp;
};

}
