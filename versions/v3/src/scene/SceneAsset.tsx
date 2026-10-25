import { Component, Suspense, type ReactNode } from 'react';
class AssetBoundary extends Component<{children:ReactNode},{failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?null:this.props.children}
}
export default function SceneAsset({children}:{children:ReactNode}){return <AssetBoundary><Suspense fallback={null}>{children}</Suspense></AssetBoundary>}
