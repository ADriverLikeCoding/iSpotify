//
//  WebView.swift
//  iSpotify
//
//

import SwiftUI
import WebKit
import OSLog

///‼️如果没有把user agent 设置上iphone 的safari，就不能正常播放，因为spotify会根据user agent来判断是否需要下载app还是提供web player
struct WebView: UIViewRepresentable {
    
    var url: URL
    
    var type: PageType = .smartphone
    
    private var userAgent: String {
        type.userAgent
    }
    
    private var injectFecth: Bool {
        if type == .smartphone {
            return true
        }
        
        return false
    }
    
    func makeUIView(context: Context) -> WKWebView {
        var wkWebView = WKWebView()
        let configuration = wkWebView.configuration
        // enable autoplay on init
        configuration.mediaTypesRequiringUserActionForPlayback = []
        let frame = wkWebView.frame
        // 要是现实能autoplay，就需要重新初始化一次webview
        wkWebView = WKWebView(frame: frame, configuration: configuration)
        wkWebView.navigationDelegate = context.coordinator
        wkWebView.uiDelegate = context.coordinator
        wkWebView.customUserAgent = userAgent
       
        configJSMessagHandler(handler: context.coordinator, for: wkWebView)
        injectJS(for: wkWebView)
        
        return wkWebView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {
        let request = URLRequest(url: url)
        uiView.configuration.mediaTypesRequiringUserActionForPlayback = []
        uiView.load(request)
    }
    
}

extension WebView {
    func makeCoordinator() -> Coordinator {
        Coordinator()
    }
    
    final class Coordinator: NSObject {}
}

extension WebView.Coordinator: WKNavigationDelegate {
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        /// 处理页面跳转事件
        logger.debug("load: \(navigationAction.request.url?.absoluteString ?? "")")
        decisionHandler(.allow)
    }
}

extension WebView.Coordinator: WKUIDelegate{
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        /// 用于创建新的窗口
        return nil
    }
}

extension WebView {
    enum PageType {
        case smartphone
        case computer
        
        var userAgent: String {
            switch self {
            case .smartphone:
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1"
            case .computer:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15"
            }
        }
    }
}


// MARK: - javascript

extension WebView {
    /// 配置js的inject
    func injectJS(for wkWebView: WKWebView) {
        var javascriptNames: [String] = ["logger",
                                         "xhr-monitor",
                                         "observer",
                                         "inject-fetch",
                                         "element-monitor"]
        switch type {
        case .computer:
            let computerJsNames = ["enable-open-on-moblie", "clear-page", "mark-premium-device-name"]
            javascriptNames.append(contentsOf: computerJsNames)
        case .smartphone:
            javascriptNames.append("enable-track-row")
        }
        
        injectJS(javascriptNames, at: .atDocumentStart, for: wkWebView)
    }
    
    /// js要与wkwebview通信,需要为wkwebview设置handler，然后在handler里监听js发送回来的消息
    func configJSMessagHandler(handler: WKScriptMessageHandler, for wkWebView: WKWebView) {
        
        /// js在页面上调用window.webkit.messageHandlers.<name>.postMessage(...)来向wkwebview发送消息
        /// 这里我们设置的接受消息的名称是js_log
        wkWebView.configuration.userContentController.add(handler, name: "js_log")
        wkWebView.configuration.userContentController.add(handler, name: "log")
        wkWebView.configuration.userContentController.add(handler, name: "error")
        switch type {
        case .computer:
            wkWebView.configuration.userContentController.add(handler, name: "computer_page_ready")
        case .smartphone:
            wkWebView.configuration.userContentController.add(handler, name: "phone_page_ready")
        }
        
    }
}

extension WebView {
    private func injectJS(_ javascriptNames: [String],at injectionTime: WKUserScriptInjectionTime, for wkWebView: WKWebView) {
        javascriptNames.forEach { javascriptName in
            guard let scriptURL = Bundle.main.url(forResource: javascriptName, withExtension: "js") else {
                fatalError("can not find \(javascriptName).js")
            }
            
            guard let scriptContent = try? String(data: Data(contentsOf: scriptURL), encoding: .utf8) else{
                fatalError("can not parse javascript content for \(javascriptName).js")
            }
            let javaScript = WKUserScript(source: scriptContent, injectionTime: injectionTime, forMainFrameOnly: true)
            wkWebView.configuration.userContentController.addUserScript(javaScript)
        }
    }
}

/// 实现接受js发送的消息的监听
extension WebView.Coordinator: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        
        if message.name == "log" {
            logger.debug("js log: \(message.body as? String ?? "")")
        }
        
        if message.name == "error" {
            logger.error("js error: \(message.body as? String ?? "")")
        }
    }
}

fileprivate let logger = Logger(subsystem: "com.app.ios.ispotify", category: "webview")

