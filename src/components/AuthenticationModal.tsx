import { UserCredential } from 'firebase/auth'
import { Box, BoxExtendedProps, Button, Layer, Paragraph, TextArea, TextInput } from 'grommet'
import * as React from 'react'
import Labeled from './Labeled'
import ModalBody from './ModalBody'

interface AuthenticationModalProps {
    show: boolean
    new?: boolean
    create: ( user: string, email: string, pass: string ) => Promise<UserCredential>
    signIn: ( email: string, pass: string ) => Promise<UserCredential>
    closeFn: () => void
}

enum AuthStatus {
    Unknown,
    Verifying,
    Valid,
    Error
}


const AuthenticationModal: React.FC<AuthenticationModalProps> = ( props ) => {
    const [ user, setUser ] = React.useState( "" )
    const [ email, setEmail ] = React.useState( "" )
    const [ pass, setPass ] = React.useState( "" )
    const [ status, setStatus ] = React.useState( AuthStatus.Unknown )

    const onConfirm = () => {
        setStatus( AuthStatus.Verifying )
        const promise = ( () => {
            if( props.new ) {
                return props.create( user, email, pass )
            }
            else {
                return props.signIn( email, pass )
            }
        } )()

        promise
            .then( onClose )
            .catch( () => setStatus( AuthStatus.Error ) )
    }

    const onClose = () => {
        setStatus( AuthStatus.Unknown )
        setEmail( "" )
        setPass( "" )
        props.closeFn()
    }

    const infoText = ( () => {
        if( props.new ) {
            return "Create new account"
        }
        return "Sign in to existing account"
    } )()

    const confirmButtonText = props.new? "Sign Up" : "Log In"

    return props.show &&
        <Layer
            onEsc={props.closeFn}
            onClickOutside={props.closeFn}>
            <ModalBody>
                <Paragraph>
                    {infoText}
                </Paragraph>
                <Labeled
                    label="Email">
                    <TextInput
                        placeholder="something@email.com"
                        value={email}
                        onChange={( e ) => setEmail( e.target.value )}/>
                </Labeled>
                {props.new && <Labeled
                    label="Username">
                    <TextInput
                        value={user}
                        onChange={( e ) => setUser( e.target.value )}/>
                </Labeled>}
                <Labeled
                    label="Password">
                    <TextInput
                        value={pass}
                        type="password"
                        onChange={( e ) => setPass( e.target.value )}/>
                </Labeled>
                <Box direction="row" gap="medium">
                    <Button
                        label="Cancel"
                        onClick={onClose}/>
                    <Button
                        label={confirmButtonText}
                        color="brand"
                        onClick={onConfirm}/>
                </Box>
            </ModalBody>
        </Layer>
}

export default AuthenticationModal
